# Skill: Create NestJS Module (POS)

## Objetivo
Generar un módulo completo en NestJS siguiendo buenas prácticas.

## Debe incluir:
- Entity
- DTOs (create/update)
- Service
- Controller

## Reglas:
- Usar TypeORM
- Usar class-validator
- Seguir arquitectura modular
- No lógica en controller

## Consideraciones POS:
- Si el módulo maneja ventas → usar transacciones
- Si maneja stock → incluir branch_id
- Si maneja usuario → incluir roles

## Ejemplo de uso:

"Create a product module for a POS system with name, price and store relation"