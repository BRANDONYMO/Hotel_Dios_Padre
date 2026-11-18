import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bitacora } from './bitacora.entity';

@Injectable()
export class BitacoraService {
  constructor(
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
  ) {}

  // Función que llamaremos desde otros módulos cuando alguien haga un cambio
  async registrarAccion(usuarioId: number, accion: string, detalles: string) {
    const registro = this.bitacoraRepository.create({
      usuarioId,
      accion,
      detalles,
    });
    await this.bitacoraRepository.save(registro);
  }

  // Función para que el Superadministrador vea la tabla
  async obtenerHistorial() {
    return this.bitacoraRepository.find({
      relations: ['usuario'], // Trae los datos de quién lo hizo
      order: { fechaHora: 'DESC' }, // Ordena del más reciente al más antiguo
      take: 1000, // Límite de seguridad para no saturar la memoria
    });
  }
}