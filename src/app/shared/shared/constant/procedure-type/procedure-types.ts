import { ProcedureType } from '../../enum/procedure/procedure-type';

export const ProcedureAppointed = {
    ProceduresTypeID: ProcedureType.Appoint,
    ProceduresTypeName: "Bổ nhiệm",
    Key: "appointed"
}

export const ProcedureDismiss = {
    ProceduresTypeID: ProcedureType.Dismiss,
    ProceduresTypeName: "Miễn nhiệm",
    Key: "dismiss"
}

export const ProcedureTransfer = {
    ProceduresTypeID: ProcedureType.Transfer,
    ProceduresTypeName: "Thuyên chuyển",
    Key: "displacement"
}
export const ProcedureTermination = {
    ProceduresTypeID: ProcedureType.Termination,
    ProceduresTypeName: "Nghỉ việc",
    Key: "termination"
}

export const ProcedureTypes = [
    {
        ProceduresTypeID: ProcedureType.Appoint,
        ProceduresTypeName: "Bổ nhiệm",
        Key: "appointed"
    },
    {
        ProceduresTypeID: ProcedureType.Dismiss,
        ProceduresTypeName: "Miễn nhiệm",
        Key: "dismiss"
    },
    {
        ProceduresTypeID: ProcedureType.Transfer,
        ProceduresTypeName: "Thuyên chuyển",
        Key: "displacement"
    },
    {
        ProceduresTypeID: ProcedureType.Termination,
        ProceduresTypeName: "Nghỉ việc",
        Key: "termination"
    }
]