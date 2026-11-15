import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { TiposHabitacionService } from './tiposhabitacion.service';
import { TiposHabitacionController } from './tiposhabitacion.controller';
import { BitacoraModule } from '../bitacora/bitacora.module'; // <-- IMPORTACIÓN NUEVA

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoHabitacion]),
    BitacoraModule, // <-- MÓDULO AGREGADO
  ],
  providers: [TiposHabitacionService],
  controllers: [TiposHabitacionController],
  exports: [TiposHabitacionService],
})
export class TiposHabitacionModule {}