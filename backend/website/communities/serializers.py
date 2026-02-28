from rest_framework import serializers
from .models import Community, Membership

class MembershipSerializer(serializers.ModelSerializer):
    username= serializers.SerializerMethodField()

    class Meta:
        model=Membership
        fields=['id', 'username', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']

    def get_username(self, obj):
        return obj.user.username

class CommunitySerializer(serializers.ModelSerializer):
    total_members=serializers.SerializerMethodField()
    creator_username=serializers.SerializerMethodField()
    is_member=serializers.SerializerMethodField()

    class Meta:
        model=Community
        fields=[
            'id', 'name', 'description', 'category', 'total_members', 'creator_username',
            'owner', 'created_at', 'status', 'reviewed_by', 'is_member',
            'reviewed_at', 'relocation_reason'
        ]
        read_only_fields=['id', 'created_at', 'status', 'reviewed_by', 'reviewed_at']
    
    def get_creator_username(self, obj):
        if obj.owner:
            return obj.owner.username
        return "Usuario Eliminado"

    def get_total_members(self, obj):
        return obj.memberships.count()
    
    def get_is_member(self, obj):
        user=self.context.get('request').user
        if user and user.is_authenticated:
            return obj.memberships.filter(user=user).exists()
        return False
    
    def get_user_role(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            membership = obj.memberships.filter(user=user).first()
            if membership:
                return membership.role
        return None

    
