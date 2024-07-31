import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

// import {AiFillHome} from 'react-icons/ai'

// import {FiLogOut} from 'react-icons/fi'
// import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-large-view">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo-image"
            />
          </Link>
          <ul className="list-container">
            <li className="list-item">
              <Link to="/">Home</Link>
            </li>
            <li className="list-item">
              <Link to="/jobs">Jobs</Link>
            </li>
            <li className="list-item">
              <button
                type="button"
                className="header-button"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
