// ** Type import
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AppDispatch, RootState } from 'src/store'
/*import {
  fetchData,
  fetchDataObserved,
  fetchDataRecib,
  fetchDataRecibWorkflow,
  fetchDataSend,
  fetchDataSendWorkflow
} from 'src/store/apps/doc'*/

const navigation = (): VerticalNavItemsType => {
  const dispatch = useDispatch<AppDispatch>()
  const [role, setRole] = useState<string>('')

  return [
    {
      title: `Home `,
      path: '/home',
      icon: 'mdi:home-outline'
    },

    /*
    {
      title: 'Activos',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'Nuevo Activo',
          path: '/listaact/asset',
          icon: 'mdi:account-group'
        },
        {
          title: 'Grupos Contables',
          path: '/depreciaciones/getprovider',
          icon: 'mdi:account-group'
        }
      ]
    },
    {
      title: 'Documentos',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: `Personales (${longPersonales})`,
          path: '/enviar'
        },
        {
          title: `Enviados (${longEnviados})`,
          path: '/enviados'
          //icon: 'mdi:form-select'
        },
        {
          title: `Recibidos (${longRecibidos})`,
          path: 'documents/recibidos'
        },
        {
          title: `Observados (${longObservados})`,
          path: 'documents/observados'
        }
        {
          title: 'Enviar',
          path: 'documents/enviar'
          //icon: 'mdi:form-select'
        }
      ]
    },*/
    {
      title: 'Editor de texto',
      path: '/textEditor',
      icon: 'mdi:text-box-edit-outline'
    },
    {
      title: `Borrador`,
      path: '/documents/enviar',
      icon: 'mdi:form-select'
    },
    {
      title: `Enviados`,
      path: '/documents/enviados',
      icon: 'mdi:send-outline'
    },
    {
      title: `Recibidos `,
      path: '/documents/recibidos',
      icon: 'mdi:file-document-check-outline'
    },
    {
      title: `Observados`,
      path: '/documents/observados',
      icon: 'mdi:alert-octagon-outline'
    },
    {
      title: 'Eliminados',
      path: '/documents/inactives',
      icon: 'mdi:delete-outline'
    },
    {
      title: 'Flujo de trabajo',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: `Crear`,
          path: '/flujo-trabajo'
        },
        {
          title: `Lista`,
          path: '/flujo-trabajo/table'
          //icon: 'mdi:form-select'
        }
        /*
        {
          title: `Lista2`,
          path: '/flujo-trabajo/table2'
          //icon: 'mdi:form-select'
        }*/
      ]
    },
    /*
    {
      title: 'Plantilas',
      path: '/template',
      icon: 'mdi:file-document'
    },
    {
      title: 'Multiple',
      path: '/documents/multiple',
      icon: 'mdi:file-document'
    },*/
    {
      title: 'Multiple',
      path: '/multiple',
      icon: 'mdi:file-document'
    }
  ]
}

export default navigation
