import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import SimilarJobItem from '../SimilarJobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDataDetails: {},
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    console.log(id)

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        id: data.job_details.id,
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const updatedSimilarJobDetails = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(updatedData)
      console.log(updatedSimilarJobDetails)

      this.setState({
        jobDataDetails: updatedData,
        similarJobData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
    return null
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobData} = this.state
    // if (jobDataDetails.length >= 1) {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,

      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDataDetails
    return (
      <>
        <div className="job-container">
          <div className="first-part">
            <div className="title-rating">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="company-img"
              />
              <div className="title-container">
                <h1 className="title">{title}</h1>
                <div className="star-card">
                  <AiFillStar size={24} />
                  <p className="text">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="left-pack">
                <div className="location">
                  <MdLocationOn size={24} />
                  <p className="text">{location}</p>
                </div>
                <div className="job-type">
                  <p className="text">{employmentType}</p>
                </div>
              </div>
              <div className="right-part">
                <p className="text">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="line" />
            <div className="description-card">
              <h1 className="heading">Description</h1>
              <a href={companyWebsiteUrl} className="link">
                Visit <BiLinkExternal size={24} />
              </a>
            </div>
            <p className="text">{jobDescription}</p>
            <h1 className="heading">Skills</h1>
            <ul className="list-container">
              {skills.map(eachData => (
                <li className="list-item" key={eachData.name}>
                  <img
                    src={eachData.imageUrl}
                    alt={eachData.name}
                    className="image"
                  />
                  <p className="text">{eachData.name}</p>
                </li>
              ))}
            </ul>
            <div className="company-life-container">
              <div className="company-life">
                <h1 className="title">Life at Company</h1>

                <p className="text">{lifeAtCompany.description}</p>
              </div>
              <img
                className="life-img"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <p className="heading">Similar Jobs</p>
          <ul className="list-container">
            {similarJobData.map(eachItem => (
              <SimilarJobItem
                key={eachItem.id}
                similarJobsData={eachItem}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </div>
      </>
    )
    // }
    // return null
  }

  onRetry = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure">Oops! Something Went Wrong</h1>
      <p className="fail-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
