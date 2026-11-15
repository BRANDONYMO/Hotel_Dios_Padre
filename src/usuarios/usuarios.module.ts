import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { AsignacionLimpieza } from '../asignaciones-limpieza/entities/asignacion-limpieza.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { BitacoraModule } from '../bitacora/bitacora.module'; // <-- IMPORTACIÓN NUEVA

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, AsignacionLimpieza]),
    BitacoraModule, // <-- MÓDULO AGREGADO AQUÍ
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}