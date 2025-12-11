import { atom } from 'jotai'

export const colorAtom = atom('rojizo')

export const tamañoAtom = atom('mediano')

export const actividadesAtom = atom(['dormir', 'comer', 'dormir después de comer'])

export const amigosAtom = atom([
  {
    nombre: 'Gandalf',
    color: 'gris',
    pelea: true
  },
  {
    nombre: 'Campanita',
    color: 'calico',
    pelea: false
  }
])