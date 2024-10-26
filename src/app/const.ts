import { SearchStatusEnum } from "./enum";

export const isPending = (status: SearchStatusEnum) => status === SearchStatusEnum.PENDING
export const isFinished = (status: SearchStatusEnum) => status === SearchStatusEnum.FINISHED