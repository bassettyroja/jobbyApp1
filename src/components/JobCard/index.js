import {Link} from 'react-router-dom'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    rating,
    location,
    packagePerAnnum,
    jobDescription,
    employmentType,
    title,
    id,
  } = jobData
  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="list-container">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-container">
            <h1 className="heading">{title}</h1>
            <div className="star-rating">
              <BsStarFill />
              <p className="text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-container">
          <div className="left-part">
            <div className="location">
              <MdLocationOn />
              <p className="text">{location}</p>
            </div>
            <div className="emp-type">
              <BsFillBriefcaseFill />
              <p className="text">{employmentType}</p>
            </div>
          </div>
          <p className="heading">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="heading">Description</h1>
        <p className="text">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
