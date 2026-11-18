import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioLavanderia } from './entities/inventario-lavanderia.entity';
import { ControlBlancos } from './entities/control-blancos.entity';

@Injectable()
export class LavanderiaService {
  constructor(
    @InjectRepository(InventarioLavanderia)
    private inventarioRepo: Repository<InventarioLavanderia>,
    @InjectRepository(ControlBlancos)
    private blancosRepo: Repository<ControlBlancos>,
  ) {}

  obtenerInventario() {
    return this.inventarioRepo.find({ order: { id: 'DESC' } });
  }

  crearArticuloInventario(data: any) {
    const articulo = this.inventarioRepo.create(data);
    return this.inventarioRepo.save(articulo);
  }

  async actualizarArticuloInventario(id: number, data: any) {
    await this.inventarioRepo.update(id, data);
    return this.inventarioRepo.findOneBy({ id });
  }

  async eliminarArticuloInventario(id: number) {
    const articulo = await this.inventarioRepo.findOneBy({ id });
    if (!articulo) throw new NotFoundException('Artículo no encontrado');
    await this.inventarioRepo.remove(articulo);
    return { message: 'Artículo eliminado' };
  }

  obtenerBlancos() {
    return this.blancosRepo.find({ order: { id: 'DESC' } });
  }

  crearRegistroBlancos(data: any) {
    const registro = this.blancosRepo.create(data);
    return this.blancosRepo.save(registro);
  }

  async actualizarRegistroBlancos(id: number, data: any) {
    await this.blancosRepo.update(id, data);
    return this.blancosRepo.findOneBy({ id });
  }

  async eliminarRegistroBlancos(id: number) {
    const registro = await this.blancosRepo.findOneBy({ id });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    await this.blancosRepo.remove(registro);
    return { message: 'Registro eliminado' };
  }
}
