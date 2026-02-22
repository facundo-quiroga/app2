import { DailyPlan, DayType, Activity } from './types';

export const PLAN_DATA: Record<DayType, DailyPlan> = {
  RUGBY: {
    nutrition: [
      { id: 'n1', time: '07:30', name: 'Desayuno', description: '4 claras + 2 huevos, 60g avena, 1 plátano, Café', kcal: 600 },
      { id: 'n2', time: '10:30', name: 'Merienda Dulce', description: 'Gelatina ligera, 170g yogur griego descremado, Stevia + cacao', kcal: 150, protein: 15 },
      { id: 'n3', time: '13:00', name: 'Almuerzo', description: '180g pollo/carne, 150g arroz cocido, Verduras asadas, 1 cda aceite oliva', kcal: 700, protein: 50 },
      { id: 'n4', time: '15:30', name: 'Snack Oficina', description: 'Bastones de zanahoria/pepino, Infusión. Opcional: 1 fruta chica', kcal: 50 },
      { id: 'n5', time: '17:30', name: 'Merienda Pre-Gym', description: '2 tostadas integrales, 120g jamón natural o atún, 1 queso feta magro', kcal: 350 },
      { id: 'n6', time: '21:00', name: 'Pre-Rugby', description: '1 plátano, 1 cda suero, 2 tostadas blancas con miel', kcal: 300, isQuickCarb: true },
      { id: 'n7', time: '00:15', name: 'Post-Rugby', description: '1 cda suero, 1 fruta chica', kcal: 200 }
    ],
    activity: [] // Will be populated per day
  },
  NO_RUGBY: {
    nutrition: [
      { id: 'n1', time: '07:30', name: 'Desayuno', description: '4 claras + 2 huevos, 60g avena, 1 plátano, Café', kcal: 600 },
      { id: 'n2', time: '10:30', name: 'Merienda Dulce', description: 'Gelatina ligera, 170g yogur griego descremado, Stevia + cacao', kcal: 150, protein: 15 },
      { id: 'n3', time: '13:00', name: 'Almuerzo', description: '180g pollo/carne, 150g arroz cocido, Verduras asadas, 1 cda aceite oliva', kcal: 700, protein: 50 },
      { id: 'n4', time: '15:30', name: 'Snack Oficina', description: 'Bastones de zanahoria/pepino, Infusión. Opcional: 1 fruta chica', kcal: 50 },
      { id: 'n5', time: '17:30', name: 'Merienda Pre-Gym', description: '2 tostadas integrales, 120g jamón natural o atún, 1 queso feta magro', kcal: 350 }
    ],
    activity: []
  },
  SATURDAY: {
    nutrition: [
      { id: 'n1', time: '07:30', name: 'Desayuno', description: '4 claras + 2 huevos, 60g avena, 1 plátano, Café', kcal: 600 },
      { id: 'n2', time: '10:30', name: 'Merienda Dulce', description: 'Gelatina ligera, 170g yogur griego descremado, Stevia + cacao', kcal: 150, protein: 15 },
      { id: 'n3', time: '13:00', name: 'Almuerzo', description: '180g pollo/carne, 150g arroz cocido, Verduras asadas, 1 cda aceite oliva', kcal: 700, protein: 50 },
      { id: 'n4', time: '15:30', name: 'Snack Oficina', description: 'Bastones de zanahoria/pepino, Infusión. Opcional: 1 fruta chica', kcal: 50 },
      { id: 'n5', time: '20:00', name: 'Comida Social', description: 'Comida social controlada. SIN repetir postre.', kcal: 800 }
    ],
    activity: [
      { id: 'a1', time: '10:00', name: 'Movilidad + Caminata', duration: '30 min', exercises: [{ name: 'Caminar 30 min' }, { name: 'Rutina de movilidad' }] }
    ]
  },
  SUNDAY: {
    nutrition: [
      { id: 'n1', time: '09:00', name: 'Desayuno', description: '4 claras + 2 huevos, 60g avena, Café', kcal: 500 },
      { id: 'n3', time: '14:00', name: 'Almuerzo', description: 'Proteína magra + Verduras abundantes', kcal: 600 },
      { id: 'n5', time: '19:00', name: 'Cena Ligera', description: 'Ensalada completa con proteína', kcal: 500 }
    ],
    activity: [
      { id: 'a1', time: '00:00', name: 'Descanso Total', exercises: [{ name: 'Recuperación activa' }] }
    ]
  }
};

export const WEEKLY_ACTIVITY: Record<number, Activity[]> = {
  1: [ // Lunes
    { id: 'a1', time: '07:00', name: 'Fuerza Pierna', duration: '75 min', exercises: [
      { name: 'Sentadilla', sets: '5x5' },
      { name: 'Peso muerto rumano', sets: '4x6' },
      { name: 'Zancadas caminando', sets: '3x8' },
      { name: 'Empuje de cadera', sets: '4x6' },
      { name: 'Plancha con carga', sets: '3x30 seg' }
    ]}
  ],
  2: [ // Martes
    { id: 'a1', time: '18:15', name: 'Potencia + Torso', duration: '75 min', exercises: [
      { name: 'Saltos al cajón', sets: '5x3' },
      { name: 'Sprint', sets: '6x30 m' },
      { name: 'Prensa banca', sets: '4x5' },
      { name: 'Dominadas lastradas', sets: '4x6' },
      { name: 'Lanzamientos balón', sets: '4x5' }
    ]},
    { id: 'a2', time: '22:00', name: 'Rugby', exercises: [{ name: 'Entrenamiento Rugby' }] }
  ],
  3: [ // Miércoles
    { id: 'a1', time: '18:15', name: 'Ala Estética', duration: '75 min', exercises: [
      { name: 'Prensa inclinado mancuernas', sets: '4x8' },
      { name: 'Elevaciones laterales', sets: '4x12' },
      { name: 'Remo con barra', sets: '4x8' },
      { name: 'Jalón de cara', sets: '3x15' },
      { name: 'Curl de bíceps', sets: '3x10' },
      { name: 'Rueda abdominal', sets: '3x12' }
    ]}
  ],
  4: [ // Jueves
    { id: 'a1', time: '18:15', name: 'Velocidad + Fuerza baja', duration: '75 min', exercises: [
      { name: 'Escalera de coordinación', sets: '10 min' },
      { name: 'Cambios de dirección', sets: '8 reps' },
      { name: 'Arrastre trineo', sets: '6x20 m' },
      { name: 'Peso muerto', sets: '3x4 pesado' },
      { name: 'Núcleo explosivo rotacional' }
    ]},
    { id: 'a2', time: '22:00', name: 'Rugby', exercises: [{ name: 'Entrenamiento Rugby' }] }
  ],
  5: [ // Viernes
    { id: 'a1', time: '07:00', name: 'Fuerza Torso', duration: '75 min', exercises: [
      { name: 'Prensa banca', sets: '5x5' },
      { name: 'Dominadas', sets: '5x5' },
      { name: 'Fondos', sets: '4x6' },
      { name: 'Remo pesado', sets: '4x6' },
      { name: 'Paseo del granjero', sets: '4 rondas' }
    ]}
  ],
  6: PLAN_DATA.SATURDAY.activity,
  0: PLAN_DATA.SUNDAY.activity
};

export const getDayType = (day: number): DayType => {
  if (day === 0) return 'SUNDAY';
  if (day === 6) return 'SATURDAY';
  if ([1, 2, 4].includes(day)) return 'RUGBY';
  return 'NO_RUGBY';
};
