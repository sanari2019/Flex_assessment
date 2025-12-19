import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PropertyLocation } from '@/data/propertyLocations';
import { getCityCenter } from '@/data/propertyLocations';
import { Star, MapPin as MapPinIcon } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface PropertyMapProps {
  properties: PropertyLocation[];
  selectedCity: string;
  onPropertyClick?: (propertyId: string) => void;
}

// Component to handle map view changes when city changes
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1,
    });
  }, [center, zoom, map]);

  return null;
}

export function PropertyMap({ properties, selectedCity, onPropertyClick }: PropertyMapProps) {
  // Calculate map center and zoom based on selected city
  const { center, zoom } = useMemo(() => {
    const cityCenter = getCityCenter(selectedCity);

    // If showing all cities, use a wider view
    if (selectedCity === 'all') {
      return {
        center: [48.0, 2.0] as [number, number], // Center of Europe
        zoom: 5,
      };
    }

    // City-specific zoom levels
    return {
      center: [cityCenter.lat, cityCenter.lng] as [number, number],
      zoom: 13,
    };
  }, [selectedCity]);

  // Custom marker icon
  const createCustomIcon = (price: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="flex flex-col items-center">
          <div class="bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg font-semibold text-sm whitespace-nowrap hover:scale-110 transition-transform cursor-pointer">
            £${price}
          </div>
          <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent" style="border-top: 8px solid hsl(var(--primary))"></div>
        </div>
      `,
      iconSize: [60, 45],
      iconAnchor: [30, 45],
    });
  };

  if (properties.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <MapPinIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No properties to display</p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Adjust your filters to see properties on the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController center={center} zoom={zoom} />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.coordinates.lat, property.coordinates.lng]}
            icon={createCustomIcon(property.price)}
            eventHandlers={{
              click: () => {
                if (onPropertyClick) {
                  onPropertyClick(property.id);
                }
              },
            }}
          >
            <Popup maxWidth={280} className="custom-popup">
              <div className="p-2">
                <a
                  href={`/property/${property.id}`}
                  className="block group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <MapPinIcon className="h-3 w-3" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">£{property.price}</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs font-semibold text-foreground mb-2">Legend</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">£</div>
          <span>Price per night</span>
        </div>
        <div className="text-xs text-muted-foreground/80 mt-1">
          Click markers for details
        </div>
      </div>

      {/* Property Count Badge */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg z-[1000]">
        <div className="text-sm font-semibold text-foreground">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'}
        </div>
        <div className="text-xs text-muted-foreground capitalize">{selectedCity}</div>
      </div>
    </div>
  );
}
