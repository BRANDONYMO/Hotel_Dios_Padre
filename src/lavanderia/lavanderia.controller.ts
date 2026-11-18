import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LavanderiaService } from './lavanderia.service';

@Controller('lavanderia')
export class LavanderiaController {
  constructor(private readonly lavanderiaService: LavanderiaService) {}

  @Get('inventario')
  obtenerInventario() {
    return this.lavanderiaService.obtenerInventario();
  }

  @Post('inventario')
  crearArticuloInventario(@Body() data: any) {
    return this.lavanderiaService.crearArticuloInventario(data);
  }

  @Patch('inventario/:id')
  actualizarArticuloInventario(@Param('id') id: string, @Body() data: any) {
    return this.lavanderiaService.actualizarArticuloInventario(+id, data);
  }

  @Delete('inventario/:id')
  eliminarArticuloInventario(@Param('id') id: string) {
    return this.lavanderiaService.eliminarArticuloInventario(+id);
  }

  @Get('blancos')
  obtenerBlancos() {
    return this.lavanderiaService.obtenerBlancos();
  }

  @Post('blancos')
  crearRegistroBlancos(@Body() data: any) {
    return this.lavanderiaService.crearRegistroBlancos(data);
  }

  @Patch('blancos/:id')
  actualizarRegistroBlancos(@Param('id') id: string, @Body() data: any) {
    return this.lavanderiaService.actualizarRegistroBlancos(+id, data);
  }

  @Delete('blancos/:id')
  eliminarRegistroBlancos(@Param('id') id: string) {
    return this.lavanderiaService.eliminarRegistroBlancos(+id);
  }
}