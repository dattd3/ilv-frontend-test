import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { groupUsersConfig } from ".."

const Note = (props) => {
    const { t } = useTranslation()
    const lstItems = Object.values(groupUsersConfig)
 
    return (
        <div className="d-inline-flex align-items-center note-block">
            {
                (lstItems || []).map((item, i) => {
                    return (
                        <Fragment key={`note-${i}`}>
                            <span className="d-inline-flex align-items-center"><img src={item.icon} alt="Note" className="icon" />{item.label}</span>
                            {i !== lstItems?.length - 1 && (<span className="separation"></span>)}
                        </Fragment>
                    )
                })
            }
        </div>
    )
}

export default Note
