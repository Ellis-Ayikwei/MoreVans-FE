from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from pricing.services import PricingService

class RequestViewSet(viewsets.ModelViewSet):
    # ... existing code ...

    @action(detail=False, methods=['post', 'put'])
    def submit_step1(self, request):
        """Handle step 1 submission (Contact Details)"""
        try:
            data = request.data.copy()
            data['status'] = 'draft'
            
            if request.method == 'POST':
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()
            else:  # PUT
                request_id = data.pop('request_id', None)
                if not request_id:
                    return Response({'error': 'request_id is required for update'}, status=status.HTTP_400_BAD_REQUEST)
                
                instance = self.get_queryset().get(id=request_id)
                serializer = self.get_serializer(instance, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            
            return Response({
                'message': 'Step 1 submitted successfully',
                'request_id': instance.id
            }, status=status.HTTP_201_CREATED if request.method == 'POST' else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post', 'put'])
    def submit_step2(self, request, pk=None):
        """Handle step 2 submission (Locations)"""
        try:
            if request.method == 'POST':
                data = request.data.copy()
                data['status'] = 'draft'
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()
            else:  # PUT
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            
            return Response({
                'message': 'Step 2 submitted successfully',
                'request_id': instance.id
            }, status=status.HTTP_201_CREATED if request.method == 'POST' else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post', 'put'])
    def submit_step3(self, request, pk=None):
        """Handle step 3 submission (Service Details)"""
        try:
            if request.method == 'POST':
                data = request.data.copy()
                data['status'] = 'draft'
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()
            else:  # PUT
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            
            return Response({
                'message': 'Step 3 submitted successfully',
                'request_id': instance.id
            }, status=status.HTTP_201_CREATED if request.method == 'POST' else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post', 'put'])
    def submit_step4(self, request, pk=None):
        """Handle step 4 submission (Schedule)"""
        try:
            if request.method == 'POST':
                data = request.data.copy()
                data['status'] = 'draft'
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()
            else:  # PUT
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            
            # Calculate price preview
            forecast_data = {
                'distance': float(request.data.get('estimated_distance', 0)),
                'weight': float(request.data.get('total_weight', 0)),
                'service_level': request.data.get('service_level', 'standard'),
                'property_type': request.data.get('property_type', 'other'),
                'number_of_rooms': request.data.get('number_of_rooms', 1),
                'floor_number': request.data.get('floor_number', 0),
                'has_elevator': request.data.get('has_elevator', False),
                'loading_time': request.data.get('loading_time'),
                'unloading_time': request.data.get('unloading_time'),
                'vehicle_type': request.data.get('vehicle_type', 'van'),
                'pickup_city': request.data.get('pickup_city'),
                'dropoff_city': request.data.get('dropoff_city'),
                'request_id': instance.id,
            }
            
            forecast_response = PricingService.calculate_price_forecast(forecast_data)
            
            return Response({
                'message': 'Step 4 submitted successfully',
                'request_id': instance.id,
                'price_forecast': forecast_response.data
            }, status=status.HTTP_201_CREATED if request.method == 'POST' else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ... rest of the existing code ... 