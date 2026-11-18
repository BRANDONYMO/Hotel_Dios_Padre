import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Habitacion } from './entities/habitacion.entity';
import { EstadoHabitacion } from './entities/estado-habitacion.entity';
import { TipoHabitacion } from '../tiposhabitacion/entities/tipo-habitacion.entity';

import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { BitacoraService } from '../bitacora/bitacora.service';

@Injectable()
export class HabitacionesService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionesRepo: Repository<Habitacion>,

    @InjectRepository(EstadoHabitacion)
    private readonly estadosRepo: Repository<EstadoHabitacion>,

    @InjectRepository(TipoHabitacion)
    private readonly tiposRepo: Repository<TipoHabitacion>,

    private readonly bitacoraService: BitacoraService,
  ) {}

  todas() {
    return this.habitacionesRepo.find({
      relations: {
        estado: true,
        tipo: true,
      },
      order: {
        numero: 'ASC',
      },
    });
  }

  async una(id: number) {
    const habitacion = await this.habitacionesRepo.findOne({
      where: { id },
      relations: {
        estado: true,
        tipo: true,
      },
    });

    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }

    return habitacion;
  }

  asignadas(id: number) {
    return this.habitacionesRepo
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.estado', 'estado')
      .leftJoinAndSelect('h.tipo', 'tipo')
      .innerJoinAndSelect('h.asignaciones', 'a', 'a.camarista_id = :id', {
        id,
      })
      .where('h.activa = 1')
      .andWhere('a.fecha = CURDATE()')
      .andWhere("a.estado <> 'Finalizada'")
      .orderBy('h.numero', 'ASC')
      .getMany();
  }

  async create(data: CreateHabitacionDto, usuarioId?: number) {
    const numero = data.numero.trim();

    await this.validarNumeroUnico(numero);
    await this.validarTipo(data.tipoId);

    const estadoId = data.estadoId ?? 1;
    await this.validarEstado(estadoId);

    const habitacion = this.habitacionesRepo.create({
      numero,
      piso: data.piso ?? null,
      tipoId: data.tipoId,
      estadoId,
      observaciones: data.observaciones ?? null,
      activa: data.activa ?? true,
    });

    const guardada = await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Registro de habitación',
        `Se registró la nueva habitación número ${numero}`
      );
    }

    return this.una(guardada.id);
  }

  async update(id: number, data: UpdateHabitacionDto, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);
    const cambios: string[] = [];

    if (data.numero !== undefined) {
      const numero = data.numero.trim();
      await this.validarNumeroUnico(numero, id);
      if (numero !== habitacion.numero) cambios.push('número');
      habitacion.numero = numero;
    }

    if (data.piso !== undefined) {
      if (data.piso !== habitacion.piso) cambios.push('piso');
      habitacion.piso = data.piso;
    }

    if (data.tipoId !== undefined) {
      await this.validarTipo(data.tipoId);
      if (data.tipoId !== habitacion.tipoId) cambios.push('tipo');
      habitacion.tipoId = data.tipoId;
    }

    if (data.estadoId !== undefined) {
      await this.validarEstado(data.estadoId);
      if (data.estadoId !== habitacion.estadoId) cambios.push('estado');
      habitacion.estadoId = data.estadoId;
    }

    if (data.observaciones !== undefined) {
      if (data.observaciones !== habitacion.observaciones) cambios.push('observaciones');
      habitacion.observaciones = data.observaciones;
    }

    if (data.activa !== undefined) {
      habitacion.activa = data.activa;
    }

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId && cambios.length > 0) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Modificación de habitación',
        `Se modificó: ${cambios.join(', ')} de la habitación ${habitacion.numero}`
      );
    }

    return this.una(id);
  }

  async guardarFoto(id: number, fotoUrl: string, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);

    habitacion.fotoUrl = fotoUrl;

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Actualización de fotografía',
        `Se actualizó la fotografía de la habitación ${habitacion.numero}`
      );
    }

    return this.una(id);
  }

  async eliminarFoto(id: number, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);

    habitacion.fotoUrl = null;

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Eliminación de fotografía',
        `Se eliminó la fotografía de la habitación ${habitacion.numero}`
      );
    }

    return this.una(id);
  }

  async estado(id: number, estadoId: number, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);

    await this.validarEstado(estadoId);

    habitacion.estadoId = estadoId;

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      const estado = await this.estadosRepo.findOneBy({ id: estadoId });
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Cambio de estado en habitación',
        `Se cambió el estado de la habitación ${habitacion.numero} a "${estado?.nombre || estadoId}"`
      );
    }

    return this.una(id);
  }

  async eliminar(id: number, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);

    habitacion.activa = false;

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Baja de habitación',
        `Se dio de baja (desactivó) la habitación ${habitacion.numero}`
      );
    }

    return {
      message: 'Habitación eliminada correctamente',
    };
  }

  async restaurar(id: number, usuarioId?: number) {
    const habitacion = await this.obtenerHabitacion(id);

    habitacion.activa = true;

    await this.habitacionesRepo.save(habitacion);

    if (usuarioId) {
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Restauración de habitación',
        `Se restauró (activó) la habitación ${habitacion.numero}`
      );
    }

    return this.una(id);
  }

  private async obtenerHabitacion(id: number) {
    const habitacion = await this.habitacionesRepo.findOneBy({ id });

    if (!habitacion) {
      throw new NotFoundException('Habitación no encontrada');
    }

    return habitacion;
  }

  private async validarNumeroUnico(numero: string, idActual?: number) {
    const existente = await this.habitacionesRepo.findOne({
      where: idActual
        ? {
            numero,
            id: Not(idActual),
          }
        : {
            numero,
          },
    });

    if (existente) {
      throw new ConflictException(
        'El número de habitación ya se encuentra registrado',
      );
    }
  }

  private async validarTipo(tipoId: number) {
    const tipo = await this.tiposRepo.findOneBy({
      id: tipoId,
    });

    if (!tipo) {
      throw new NotFoundException('El tipo de habitación no existe');
    }

    if (!tipo.activo) {
      throw new ConflictException(
        'El tipo de habitación seleccionado está inactivo',
      );
    }
  }

  private async validarEstado(estadoId: number) {
    const estado = await this.estadosRepo.findOneBy({
      id: estadoId,
    });

    if (!estado) {
      throw new NotFoundException('El estado de habitación no existe');
    }
  }
}

