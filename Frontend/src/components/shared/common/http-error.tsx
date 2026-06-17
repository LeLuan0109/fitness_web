import { API_STATUS } from "@/constants/api"

type Props = {
  errorCode: 404 | 403 | 500 | "ERR_NETWORK"
}

export const HttpError = ({ errorCode }: Props) => {
  switch (errorCode) {
    case API_STATUS.FORBIDDEN: {
      return 403
    }
    case API_STATUS.INTERNAL_SERVER: {
      return 500
    }
    case "ERR_NETWORK": {
      return "ERR_NETWORK"
    }
    default: {
      return 404
    }
  }
}
