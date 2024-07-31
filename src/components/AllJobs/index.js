import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    searchInput: '',
    checkboxInputs: [],
    profileData: [],
    jobData: [],
    radioInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = [await response.json()]
      const updatedData = fetchedData.profile_details.map(each => ({
        name: each.profile_details.name,
        profileImageUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDate,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${chekboxInputs}&minimum_package=${radioInpt}&search=${searchInput}`
    const jobOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const jobResponse = await fetch(jobApiUrl, jobOptions)
    if (jobResponse.ok === true) {
      const data = await jobResponse.json()
      const updatedJobData = data.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        jobData: updatedJobData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  onRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  onInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getJobsData,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({checkboxInputs: filteredData}),
        this.getJobsData,
      )
    }
  }

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-img" />
          <h1 className="name">{name}</h1>
          <p className="short-bio">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetry = () => {
    this.getProfileData()
  }

  onProfileFailureView = () => (
    <div className="profile-failure">
      <button className="failure-button" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onProfileFailureView()
      default:
          return null  
    }
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  renderJobsSuccessView = () => {
    const {jobData} = this.state
    const noJob = jobData.length === 0

    {
      noJob ? (
        <div className="no-job-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-image"
          />
          <h1 className="heading">No Jobs Found</h1>
          <p className="text">You could not find any jobs. Try other filters</p>
        </div>
      ) : (
        <ul className="jobs-view">
          {jobData.map(eachJob => (
            <jobCard key={eachJob.id} jobData={eachJob} />
          ))}
        </ul>
      )
    }
  }

  renderJobsFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-image"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="text">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  
  )

  renderJobsStatus=()=>{
      const {apiJobStatus}=this.state

      switch(apiJobStatus){
          case apiJobStatusConstants.initial:
              return this.renderLoadingView()
          case apiJobStatusConstants.success:
              return this.renderJobsSuccessView()
          case apiJobStatusConstants.failure:
              return this.renderJobsFailureView()
          default:
              return null            
      }

      onGetCheckboxView=()=>{
          <ul className="checkbox-container">
              {employmentTypesList.map(each=>(
                  <li className="list-item" key={each.employmentTypeId}>
                      <input type="checkbox" id={each.employmentTypeId} onChange={this.onInputOption} className="checkbox"/>
                      <label className="label" htmlFor={each.employmentTypeId} >{each.label}</label>
                  </li>
              ))}
          </ul>
      }

      onGetRadioButtonsView=()=>{
          <ul className="radio-button-container">
              {salaryRangesList.map(each=>(
                  <li className="list-item" key={each.salaryRangeId}>
                      <input type="radio" name="option" className="radio" id={each.salaryRangeId} onChange={this.onRadioOption}/>
                      <label htmlFor={each.salaryRangeId} className="label">{each.label}</label>
                  </li>
              ))}
          </ul>
      }

      onGetSearchInput=event=>{
          this.setState({searchInput:event.target.value})
      }

      onSubmitSearchInput=()=>{
          this.getJobData()
      }

      onEnterSearchInput=event=>{
          if(event.key==='enter'){
              this.getJobData()
          }
      }



      render(){
          const {searchInput,radioInput,checkboxInputs }=this.state
          return(
              <>
              <Header />
              <div className="all-job-container">
                  <div className="side-bar-container">
                      {this.renderProfileStatus()}
                      <hr className="line" />
                      <h1 className="text">Type of Employment</h1>
                      {this.onGetCheckboxView()}
                      <hr className="line" />
                      <h1 className="text">Salary Range</h1>
                      {this.onGetRadioButtonsView()}
                  </div>
                  <div>
                  <div className="job-container">
                      <input className="input" type="search" onChange={this.onGetSearchInput} onKeyDown={this.onEnterSearchInput} placeholder="search"/>
                      <button type="button" className="search-button" onClick={this.onSubmitSearchInput} data-testid="searchButton">
                          <AiOutlineSearch size={25}/>
                      </button>
                  </div>
                  {this.renderJobsStatus()}
                  </div>
              </div>
              </>
          )

      }
  }

  export default AllJobs