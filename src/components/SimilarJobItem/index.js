import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    jobDescription,
    title,
    employmentType,
    location,
    rating,
  } = jobDetails
  return (
    <li className="list-items">
      <div className="company-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-container">
          <h1 className="name">{title}</h1>
          <div className="star-container">
            <BsStarFill />
            <p className="text">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="heading">Description</h1>
      <p className="text">{jobDescription}</p>
      <div className="location-container">
        <MdLocationOn />
        <p className="text">{location}</p>
        <BsFillBriefcaseFill />
        <p className="text">{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobItem
