import { readFileSync, writeFileSync } from 'fs';

const raw = JSON.parse(readFileSync('public/venezuela-states.geojson', 'utf8'));

function simplifyCoords(coords, tolerance) {
  if (coords.length <= 4) return coords;
  const result = [coords[0]];
  for (let i = 1; i < coords.length - 1; i++) {
    const [x1, y1] = result[result.length - 1];
    const [x2, y2] = coords[i];
    if (Math.abs(x2 - x1) > tolerance || Math.abs(y2 - y1) > tolerance) {
      result.push(coords[i]);
    }
  }
  result.push(coords[coords.length - 1]);
  return result.length >= 4 ? result : coords.slice(0, 4);
}

function simplifyGeometry(geometry, tolerance) {
  if (!geometry) return geometry;
  if (geometry.type === 'Polygon') {
    return { ...geometry, coordinates: geometry.coordinates.map(ring => simplifyCoords(ring, tolerance)) };
  }
  if (geometry.type === 'MultiPolygon') {
    return { ...geometry, coordinates: geometry.coordinates.map(poly => poly.map(ring => simplifyCoords(ring, tolerance))) };
  }
  return geometry;
}

const simplified = {
  type: 'FeatureCollection',
  features: raw.features
    .filter(f => f.properties.shapeName !== 'Dependencias Federales')
    .map(f => ({
      type: 'Feature',
      properties: { name: f.properties.shapeName, iso: f.properties.shapeISO },
      geometry: simplifyGeometry(f.geometry, 0.04)
    }))
};

const out = JSON.stringify(simplified);
writeFileSync('public/venezuela-states.geojson', out);
console.log(`Done. Size: ${out.length} bytes, Features: ${simplified.features.length}`);
simplified.features.forEach(f => console.log(` - ${f.properties.name}`));
