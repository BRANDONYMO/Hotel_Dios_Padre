import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { BitacoraService } from '../bitacora/bitacora.service';

@Injectable()
export class TiposHabitacionService {
  constructor(
    @InjectRepository(TipoHabitacion) private repo: Repository<TipoHabitacion>,
    private readonly bitacoraService: BitacoraService,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const x = await this.repo.findOneBy({ id });
    if (!x) throw new NotFoundException('Registro no encontrado');
    return x;
  }

  async create(dto: any, usuarioId?: number) {
    const nuevo: any = await this.repo.save(this.repo.create(dto));
    
    if (usuarioId) {
      const nombre = dto.nombre ? `"${dto.nombre}"` : 'Nuevo Tipo';
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Creación de tipo de habitación',
        `Se creó el tipo de habitación ${nombre}`
      );
    }
    return nuevo;
  }

  async update(id: number, dto: any, usuarioId?: number) {
    const original = await this.findOne(id);
    
    const cambios: string[] = [];
    if (dto.nombre !== undefined && dto.nombre !== original.nombre) cambios.push('nombre');
    if (dto.precio !== undefined && Number(dto.precio) !== Number(original.precio)) cambios.push('precio');
    if (dto.descripcion !== undefined && dto.descripcion !== original.descripcion) cambios.push('descripción');
    if (dto.capacidad !== undefined && dto.capacidad !== original.capacidad) cambios.push('capacidad');
    if (dto.camas !== undefined && dto.camas !== original.camas) cambios.push('número de camas');

    await this.repo.update(id, dto);
    
    if (usuarioId && cambios.length > 0) {
      const nombre = dto.nombre || original.nombre;
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Modificación de tipo de habitación',
        `Se modificó: ${cambios.join(', ')} del tipo de habitación "${nombre}"`
      );
    }
    return this.findOne(id);
  }

  async remove(id: number, usuarioId?: number) {
    const registro = await this.findOne(id);
    await this.repo.delete(id);
    
    if (usuarioId) {
      const nombre = (registro as any).nombre ? `"${(registro as any).nombre}"` : 'eliminado';
      await this.bitacoraService.registrarAccion(
        usuarioId,
        'Eliminación de tipo de habitación',
        `Se eliminó el tipo de habitación ${nombre}`
      );
    }
    return { message: 'Registro eliminado' };
  }
}