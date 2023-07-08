// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
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
          title: 'Activos',
          path: '/documents/actives'
          //icon: 'mdi:form-select'
        },
        {
          title: 'Inactivos',
          path: '/documents/inactives'
        }
      ]
    }
  ]
}

export default navigation
