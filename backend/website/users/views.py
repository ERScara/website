from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from .models import SupportTicket
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

@api_view(['POST'])
@permission_classes([AllowAny])
def register_classes(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({'error':'El nombre de usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'Usuario creado con éxito', 'username': user.username, 'email': user.email, 'is_superuser': user.is_superuser}, status=status.HTTP_201_CREATED)    

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is None:
        temp_user = User.objects.filter(username=username).first()
        if temp_user:
            print(f"DEBUG: usuario: {username} existe. Activo: {temp_user.is_active}. Hash: {temp_user.password[:20]}")
        else:
            print(f"DEBUG: El usuario {username} no exite en la base de datos.")

    if user is not None:
        if user.is_active:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser
            }, status=status.HTTP_200_OK)
        else:
            print(f"ALERTA: Usuario {username} está inactivo.")
            return Response({'error':'Cuenta inactiva'})
    else:
        print(f"ERROR: Credenciales inválidas para {username}")
        return Response({'error': 'Credenciales Inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def request_deletion(request):
    username = request.data.get('username')
    email = request.data.get('email')
    reason = request.data.get('reason')

    ticket = SupportTicket.objects.create(
        username = username,
        email=email,
        reason=reason
    )

    subject = f"Solicitud de eliminación de cuenta de: {username}"
    message = f"El usuario {username}({email} solicita la baja.\n\nMotivo:\n{reason}\r\n)"

    try:
        send_mail(subject, message, 'noreply@site.com', ['esteb@site.com'],fail_silenty=False,)
        return Response({'message':'solicitud enviada con éxito.'}, status=201)
    except Exception as ex:
        return Response({'error': 'Ticket guardado, pero falló el envío de correo.'})

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    user = User.objects.filter(email=email).first()
    if user:
            temp_token = default_token_generator.make_token(user)
            temp_uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:4200/new-pass/{temp_uid}/{temp_token}"
            print(f"DEBUG - Link: {reset_link}")
            return Response({'status': 'success', 'message': 'Se ha enviado enlace de reseteo de contraseña'}, status=200)
    return Response ({'error': 'Email no encontrado'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            if not new_password:
                return Response({'Error': 'Nueva Contraseña Requerida'}, status=400)
            user.set_password(new_password)
            user.save()
            print(f"Contraseña cambiada para {user.username}")
            return Response({'message': 'Contraseña actualizada con éxito'}, status=200)
        return Response({'error': 'El enlace es inválido o ha expirado'}, status=400)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as ex:
        user = None 
        print("Error encontrado: ", repr(ex))
        
    
    