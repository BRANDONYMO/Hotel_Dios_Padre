import { CortesiasController } from './cortesias.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Huesped } from '../huespedes/huesped.entity';
import { EstadoHabitacion } from '../habitaciones/entities/estado-habitacion.entity';
import { Habitacion } from '../habitaciones/entities/habitacion.entity';
import { ReservacionHabitacion } from './entities/reservacion-habitacion.entity';
import { Reservacion } from './entities/reservacion.entity';
import { Pago } from './entities/pago.entity';
import { ReservacionesController } from './reservaciones.controller';
import { ReservacionesService } from './reservaciones.service';
import { BitacoraModule } from '../bitacora/bitacora.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservacion,
      ReservacionHabitacion,
      Habitacion,
      EstadoHabitacion,
      Huesped,
      Pago,
    ]),
   BitacoraModule, // <-- 2. Agrega BitacoraModule aquí dentro de imports
  ],
  providers: [ReservacionesService],
  controllers: [ReservacionesController, CortesiasController],
})
export class ReservacionesModule {}
