import './Profile.css';
import Navbar from "../Components/Navbar";
import ContentPage from '../Components/ContentPage';
import Content from '../Components/Content';
import axios from 'axios';
import React, { useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';

export default function Profile()
{
    const { username } = useParams();

    const params = {
        params: {
            username: username,
            limit: 10,
        },}


    return (
        <div className="profile">
            <Navbar center = {<div className='centercontent'><span className='centerusername'>{username}</span></div>}></Navbar>
            <div className="panels">
                <div className="contentpanel">
                    <div className = "profilecontainer">
                        <div className='profilepicture'>
                            <img src = "images/nopp.png" ></img>
                        </div>
                        <div className='profilestats'>
                            <div className='statcontainer'>
                                <span>Followers</span>
                                <span>0</span>
                            </div>
                            <div className='statcontainer'>
                                <span>Following</span>
                                <span>0</span>
                            </div>
                        </div>
                        <div className='profileoptions'>
                            <button className='profileoption'>Follow</button>
                            <button className='profileoption'>Send message</button>
                        </div>
                    </div>
                    <ContentPage query = "http://localhost:5000/getprofileposts" params = {params}></ContentPage>
                    

                    
                </div>
                
            </div>
        </div>
    );
}