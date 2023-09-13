// ** Type import
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AppDispatch, RootState } from 'src/store'
import { fetchData, fetchDataRecib, fetchDataSend } from 'src/store/apps/doc'

const navigation = (): VerticalNavItemsType => {
  const dispatch = useDispatch<AppDispatch>()
  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const promises = [
      dispatch(fetchData({ role })),
      dispatch(fetchDataSend({ role })),
      dispatch(fetchDataRecib({ role }))
    ]

    Promise.all(promises)
      .then(results => {
        console.log('Todas las llamadas se completaron:', results)
      })
      .catch(error => {
        console.error('Ocurrió un error:', error)
      })
  }, [dispatch, role])

  const store = useSelector((state: RootState) => state.doc)

  const longPersonales = store.data.length
  const longEnviados = store.dataSend.length
  const longRecibidos = store.dataRecib.length

  return [
    {
      title: 'Hogar',
      path: '/home',
      icon: 'mdi:home-outline'
    },

    {
      title: 'Mensajes',
      path: '/acl',
      icon: 'mdi:email-outline'
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
      title: 'Proveedores',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'Nuevo Proveedor',
          path: '/proveedores/getprovider',
          icon: 'mdi:account-check'
        }
      ]
    },
    {
      title: 'Imagen',
      path: '/user/usuario/base64/base64',
      icon: 'mdi:account-box-multiple'
    },
    */
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
        }
        /*
        {
          title: 'Enviar',
          path: 'documents/enviar'
          //icon: 'mdi:form-select'
        }*/
      ]
    },
    {
      title: 'Eliminados',
      path: '/documents/inactives',
      icon: 'mdi:file-document-outline'
    },
    {
      title: 'Flujo de trabajo',
      path: '/flujo-trabajo',
      icon: 'mdi:file-document-outline'
    }
  ]
}

export default navigation
