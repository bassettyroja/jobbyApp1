import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
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

class Jobs extends Component {
  state = {
    searchInput: '',
    employeeType: [],
    minimumSalary: 0,
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, employeeType, minimumSalary} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        title: eachJob.title,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
      }))
      this.setState({
        jobsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const jobsLength = jobsList.length > 0

    return jobsLength ? (
      <div className="job-container">
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobCard key={eachJob.id} jobData={eachJob} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-job-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-image"
        />
        <h1 className="heading">No Jobs Found</h1>
        <p className="text">We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  renderFailureView = () => (
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

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobData()
    }
  }

  onChangeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobData)
  }

  onChangeEmployType = type => {
    this.setState(
      prevState => ({employeeType: [...prevState.employeeType, type]}),
      this.getJobData,
    )
  }

  onRetryJobs = () => {
    this.getJobData()
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="job-content">
            <FiltersGroup
              getJobs={this.getJobData}
              changeSearchInput={this.onGetSearchInput}
              employmentTypesList={employmentTypesList}
              changeEmployeeList={this.onChangeEmployType}
              searchInput={searchInput}
              changeSalary={this.onChangeSalary}
              salaryRangesList={salaryRangesList}
            />
            <div className="jobs-list-container">
              <div className="search-input-container">
                <input
                  type="search"
                  placeholder="Search"
                  onChange={this.onGetSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                  className="search-input"
                  aria-label="Search Jobs"
                />
                <button
                  type="button"
                  className="search-button"
                  data-testid="searchButton"
                  onClick={this.getJobData}
                  aria-label="search"
                >
                  <BsSearch />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
