import type { BaseSearchDTO } from "./common.type"

export type PrimeContractorUsersDTO = BaseSearchDTO & {
  groups_id_in?: number | string
  roles_id_eq?: number | string
  users_email_cont?: string
  statusItem_id_eq?: number | string
  users_name_cont?: string
  // callFrom?: CallFrom
  groups_name_cont?: string
  roles_name_cont?: string
  groups_groupTypeId_eq?: number
  approvalWorkflowTypeCode?: string
  // permissions_code_in?: PermissionCode[]
  // rolePermissionStatuses_code_in?: PermissionType[]
}

export type PrimeContractorUsers = {
  id: string
  name: string
  email: string
  createdAt: string
  isInactiveUserPermission: boolean
  statusItem: {
    id: number
    code: string
    name: string
    statusItemTypeId: string
  }
  groupUsers: [
    {
      group: {
        id: number
        name: string
      }
    },
  ]
  companyUsers: [
    {
      role: {
        id: number
        name: string
      }
    },
  ]
}

export type PrimeContractorTable = {
  id: string
  department: string
  role: string
  name: string
  email: string
  createdAt: string
  status: string
}
