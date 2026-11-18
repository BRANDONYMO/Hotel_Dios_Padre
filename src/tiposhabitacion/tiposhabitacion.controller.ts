import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { TiposHabitacionService } from './tiposhabitacion.service';

@Controller('tipos-habitacion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Administrador')
export class TiposHabitacionController {
  constructor(private s: TiposHabitacionService) {}

  @Get() 
  all() {
    return this.s.findAll();
  }

  @Get(':id') 
  one(@Param('id', ParseIntPipe) id: number) {
    return this.s.findOne(id);
  }

  @Post() 
  create(
    @Body() d: any,
    @UsuarioActual() usuario: { id: number }
  ) {
    return this.s.create(d, usuario.id);
  }

  @Patch(':id') 
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() d: any,
    @UsuarioActual() usuario: { id: number }
  ) {
    return this.s.update(id, d, usuario.id);
  }

  @Delete(':id') 
  remove(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number }
  ) {
    return this.s.remove(id, usuario.id);
  }
}
