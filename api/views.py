from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .Serializers import TaskSerializer
from .models import Task

# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    return Response("api base point")

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all().order_by('-id')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, id):
    task = Task.objects.get(id=id)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
def taskUpdate(request, id):
    task = Task.objects.get(id=id)

    '''
    one way to do this is to pass in the instance and requested data to the serializer
    then check if data is valid. if yes then save() serializer instance
    '''
    # serializer = TaskSerializer(instance=task,data=request.data)

    # if serializer.is_valid():
    #     serializer.save()

    '''
    other way to implement the same is to pass on the request data to serializer, check if it is valid,
    if yes then use update() serializer instance by passing task instance and validated data
    '''
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.update(instance=task, validated_data=serializer.validated_data)

    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request, id):
    try:
        task = Task.objects.get(id=id)
        print(task)
        task.delete()
    except Task.DoesNotExist as e:
        return Response(e.__str__(), status=404)
    except Exception as e:
        return Response("Could not delete the item.")
    
    return Response("Deleted Successfully")