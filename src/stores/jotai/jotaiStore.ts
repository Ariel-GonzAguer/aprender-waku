import { atom } from 'jotai'

const colorAtom = atom('rojizo')

const tamañoAtom = atom('mediano')

const actividadesAtom = atom(['dormir', 'comer', 'dormir después de comer'])

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