from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.postgres.search import SearchVector, SearchQuery
from posts.models import Post
from posts.serializers import PostSerializer
from communities.models import Community
from communities.serializers import CommunitySerializer
from django.contrib.auth.models import User

class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query or len(query) < 3:
            return Response ({
                'posts': [],
                'communities': [],
                'users': []
            })
        posts = Post.objects.filter(is_deleted=False).annotate(
            search=SearchVector('title', 'content', 'prompt')
        ).filter(search=SearchQuery(query))[:10]

        communities = Community.objects.filter(status='approved').annotate(
            search=SearchVector('name', 'description')
        ).filter(search=SearchQuery(query))[:10]

        users = User.objects.filter(
            username__icontains=query,
            is_active=True
        ).values('id', 'username')[:10]

        return Response({
            'posts': PostSerializer(posts, many=True, context={'request': request}).data,
            'communities': CommunitySerializer(communities, many=True, context={'request': request}).data,
            'users': list(users)               
        })
