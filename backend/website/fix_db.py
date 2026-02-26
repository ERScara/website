import os
import django
from django.core.management import call_command
from django.db import connection
from io import StringIO

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def fix_sequences():
    print("Generando SQL para rastrear secuencias...")

    mis_apps = ['direct_messages', 'volcanes', 'users', 'comments']
    output = StringIO()

    try: 
        call_command('sqlsequencereset', *mis_apps , stdout=output, no_color=True)
        sql = output.getvalue()
         
        if not sql:
            print("No se generó SQL. ¿Están bien escritos los nombres de las apps?")
            return

        with connection.cursor() as cursor:
            print("Ejecutando SQL en la base de datos...")
            cursor.execute(sql)
        
        print("¡Éxito! Las secuencias han sido sincronizadas.")
    except Exception as e:
        print(f"Ocurrió un error durante la ejecución: {repr(e)}")

if __name__ == "__main__":
    fix_sequences()