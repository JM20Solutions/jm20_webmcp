#!/bin/sh
# Prueba la MISMA petición que envía el formulario (igual que la web principal). Esperado: HTTP/2 201.
K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYXZueXVjaGRzZnp0emh2YXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI2ODQsImV4cCI6MjA4NjU3ODY4NH0.dXz7vyFglA_lihma__rbtBT8afZZ1YUJEkAmqpFOL6c'
curl -i 'https://wiavnyuchdsfztzhvaua.supabase.co/rest/v1/leads' \
  -H "apikey: $K" -H "Authorization: Bearer $K" \
  -H 'Content-Type: application/json' -H 'Prefer: return=minimal' \
  -d '{"full_name":"PRUEBA borrar","company":"Prueba","email":"prueba@prueba.es","phone":"","website":"https://prueba.es/","interest":"Discovery","comments":"prueba (origen: web WebMCP)"}'
