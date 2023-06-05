import * as Tabs from '@radix-ui/react-tabs'
import Cards from './parts/cards'

import { useDisclosure } from '../../../hooks'
import { useEffectOnce } from 'usehooks-ts'
import React from 'react'

import localforage from 'localforage'

import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'

import { Modal } from '../../shared/modal'
import Button from './parts/button'
import useMemoryStore from '@renderer/stores/memory'

export const Settings = function () {
  const { action } = useMemoryStore()

  const [maxRAM, updateMaxRAM] = React.useState(3000)
  const [value, updateValue] = React.useState([0, 3000])

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffectOnce(() => {
    ;(async function () {
      const value = await localforage.getItem('system-memory')

      if (value) {
        updateValue(value)
      }
    })()
  })

  useEffectOnce(() => {
    ;(async () => {
      const x = await window.electron.ipcRenderer.invoke('system-memory')
      const totalMem = (x.totalmem / 1024 / 1024).toFixed(0)
      const totalRAM = parseInt(totalMem[0].padEnd(totalMem.length, '0'), 10)
      updateMaxRAM(totalRAM)
    })()
  })

  return (
    <Tabs.Content className="w-full h-auto px-4 py-8" value="settings">
      <Modal show={isOpen} onClose={onClose} />
      <div className="w-full block relative py-14 px-16">
        <div className="w-full max-w-sm space-y-12">
          <section className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-sand-12 text-3xl font-bold">Contas</h1>
              <p className="text-sand-9 text-lg">Escolha uma conta para acessar o servidor</p>
            </div>
            <div className="max-w-sm relative space-y-10">
              <ul className="flex flex-col space-y-4" role="list">
                <Cards />
              </ul>
              <Button onOpen={onOpen} />
            </div>
          </section>
          <section className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-sand-12 text-3xl font-bold">Java</h1>
              <div className="space-y-4">
                <p className="text-sand-10">
                  Ajuste a alocação de RAM para o seu jogo, pois uma quantidade maior resultará em
                  um melhor desempenho.
                </p>
                <p className="text-sand-10">
                  <strong className="text-sand-11">RAM Mínima:</strong> Indica a quantidade mínima
                  de RAM alocada ao iniciar o jogo. É recomendado não alocar mais de 3GB para esse
                  valor. O valor padrão é 1GB.
                </p>
                <p className="text-sand-10">
                  <strong className="text-sand-11">RAM Máxima:</strong> Indica a quantidade total de
                  RAM alocada para o jogo. Recomenda-se não ultrapassar 50% da quantidade total de
                  RAM disponível em seu PC para garantir um funcionamento adequado.
                </p>
              </div>
              <div className="w-full py-6 relative">
                <RangeSlider
                  min={512}
                  max={maxRAM}
                  defaultValue={value}
                  onInput={async (value) => await action.set(value)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Tabs.Content>
  )
}
