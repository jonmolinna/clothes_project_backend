# NestJS POS Backend Rules

## Arquitectura General
- Usar arquitectura modular de NestJS
- Cada dominio debe estar en su propio módulo:
  - auth
  - users
  - store
  - branch
  - product
  - variant
  - stock
  - sale

## Estructura por módulo
Cada módulo debe contener:
- controller
- service
- entity
- dto

Ejemplo:
modules/product/
  product.controller.ts
  product.service.ts
  product.entity.ts
  dto/
    create-product.dto.ts
    update-product.dto.ts

---

## Base de Datos
- Usar TypeORM
- Todas las entidades deben tener:
  - id autogenerado
  - createdAt
  - updatedAt

---

## Multi-sede (IMPORTANTE)
- Todas las operaciones deben considerar branch_id
- El stock SIEMPRE es por branch
- Nunca guardar stock en product o variant

---

## Seguridad
- Usar JWT para autenticación
- Nunca confiar en datos del frontend
- branchId y storeId se obtienen del token

---

## Validaciones
- Usar class-validator en todos los DTOs
- Nunca aceptar datos sin validar

---

## Ventas (CRÍTICO)
- Crear ventas usando transacciones
- Validar stock antes de vender
- Descontar stock dentro de la misma transacción

---

## Código limpio
- No lógica en controllers
- Toda lógica en services
- Métodos pequeños y claros

---

## Naming
- snake_case en base de datos
- camelCase en código

---

## Errores
- Usar excepciones de NestJS:
  - BadRequestException
  - NotFoundException
  - UnauthorizedException