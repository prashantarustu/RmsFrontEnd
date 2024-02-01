import React from 'react'

const AstroLogin = () => {
    return (
        <>
            {/* <section className="vh-100 gradient-custom">
                <div className="container  h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" >
                                <div className="card-body  text-center">
                                    <div className=" pb-5">
                                        <h4 className="fw-bold mb-5 text-uppercase  bb  ">Continue with Phone</h4>
                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label text-left" style={{fontFamily:'sans-serif'}} htmlFor="typeEmailX">Enter Your Phone Number</label>
                                            <input type="phone" id="typeMobile NoX" className="form-control form-control-lg " placeholder='Enter Mobile No...' style={{color:'#000',fontWeight:'600'}}/>
                                        </div>
                            
                                        <div className="form-outline form-white mb-4">
                                            <label className="form-label text-left" htmlFor="typePasswordX">Password</label>
                                            <input type="password" id="typePasswordX" className="form-control form-control-lg" placeholder='' />
                                        </div>
                                   
                                        <button className="btn btn-outline-light text-bold btn-lg mt-4 px-5" type="submit">Login</button>
                                    </div>
                                    <div>
                                        <p className="mb-0">Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}


            <div>
                <div className="modal fade" id="astro" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-notify modal-warning modal-dialog-centered " role="document">
                        {/*Content*/}
                        <div className="modal-content" style={{ borderRadius: '10px' }}>
                            {/*Header*/}
                            <div className="modal-header text-center p-2" style={{ backgroundColor: '#ff5722' }}>
                                <h4 className="modal-title text-white w-100 font-weight-bold " >Login with Phone</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className="white-text mr-2" style={{ fontSize: '25px' }}>×</span>
                                </button>
                            </div>
                            {/*Body*/}
                            <div className="modal-body p-4 " >
                                <div className="form-outline mb-5 px-3">
                                    <label className='form-label pt-1' data-error="wrong" data-success="right" htmlFor="form3">Enter Your Mobile Number</label>
                                    <input type="text" id="form3" className="form-control validate" placeholder='Enter Mobile No.....' />
                                </div>
                            </div>
                            {/*Footer*/}
                            <div className="pb-5 ">
                                <a type="button" className="btn astro-login text-white">GET OTP
                                    <i className="fa fa-arrow-right ml-2" />
                                </a>
                            </div>
                        </div>
                        {/*/.Content*/}
                    </div>
                </div>
                <div className="text-center">
                    <a href className="btn btn-default btn-rounded" data-toggle="modal" data-target="#astro">AsrtoCall Login</a>
                </div>
            </div>






            {/* <div className="wrapper">
                <div className="card">
                    <input type="checkbox" id="card1" className="more" aria-hidden="true" />
                    <div className="content">
                        <div className="front">
                            <div className="inner">
                                <h2>Cozy apartment</h2>
                                <div className="rating">
                                    <i className="fas fa-star" />
                                    <i className="fas fa-star" />
                                    <i className="fas fa-star" />
                                    <i className="fas fa-star" />
                                    <i className="far fa-star" />
                                </div>
                                <label htmlFor="card1" className="button" aria-hidden="true">
                                    Details
                                </label>
                            </div>
                        </div>
                        <div className="back">
                            <div className="inner">
                                <div className="info">
                                    <span>5</span>
                                    <div className="icon">
                                        <i className="fas fa-users" />
                                        <span>people</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <span>4</span>
                                    <div className="icon">
                                        <i className="fas fa-door-open" />
                                        <span>rooms</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <span>3</span>
                                    <div className="icon">
                                        <i className="fas fa-bed" />
                                        <span>beds</span>
                                    </div>
                                </div>
                                <div className="info">
                                    <span>1</span>
                                    <div className="icon">
                                        <i className="fas fa-bath" />
                                        <span>bath</span>
                                    </div>
                                </div>
                                <div className="description">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae, accusamus.</p>
                                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates earum nostrum ipsam
                                        ullam, reiciendis nam consectetur? Doloribus voluptate architecto possimus perferendis
                                        tenetur nemo amet temporibus, enim soluta nam, debitis.</p>
                                </div>
                                <div className="location">Warsaw, Poland</div>
                                <div className="price">38€ / day</div>
                                <label htmlFor="card1" className="button return" aria-hidden="true">
                                    <i className="fas fa-arrow-left" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
              
            </div> */}

        </>
    )
}

export default AstroLogin