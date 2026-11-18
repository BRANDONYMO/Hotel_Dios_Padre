import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LavanderiaService } from './lavanderia.service';
import { LavanderiaController } from './lavanderia.controller';
import { InventarioLavanderia } from './entities/inventario-lavanderia.entity';
import { ControlBlancos } from './entities/control-blancos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioLavanderia, ControlBlancos])],
  controllers: [LavanderiaController],
  providers: [LavanderiaService],
})
export class LavanderiaModule {}
