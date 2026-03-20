# Tablas
### stores (negocio)
- id
- name

### branches (sedes)
- id
- name
- store_id

### Productos (products)
- id
- name
- description
- price
- store_id

### Variantes (product_variants)
- id
- product_id
- size
- color

### Stock (stocks)
- id
- variant_id
- branch_id
- quantity

### Ventas (sales)
- id
- branch_id
- total
- payment_method
- created_at

### Detalle de venta (sale_items)
- id
- sale_id
- variant_id
- quantity
- price

### Detalle de venta (sale_items)
- id
- name
- email
- password
- role
- store_id
- branch_id
- is_active
- created_at

# Estructura en NestJS
modules/
 ├── auth/
 ├── users/
 ├── store/
 ├── branch/
 ├── product/
 ├── variant/
 ├── stock/
 ├── sale/



