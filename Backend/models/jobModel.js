import db from './db.js';

export const getJobsFromDB = (callback) => {
    const query = `
    SELECT 
        ji.*,
        ai.name,
        ai.role,
        ai.user_id AS alumni_user_id,
        m.title
    FROM 
        jobs_info ji
    LEFT JOIN 
        alumni_info ai
    ON 
        ji.created_by = ai.user_id
    LEFT JOIN 
        master_alumni_roles m
    ON 
        ai.role = m.id; -- Assuming 'role_code' is the key in the 'master' table
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.rows); // Use `results.rows` for PostgreSQL
    });
};

export const addJobOfferToDB = (jobData, callback) => {
    const query = `
        INSERT INTO jobs_info (
            job_title, 
            company_name, 
            expected_minimum_salary_per_year, 
            expected_maximum_salary_per_year, 
            location, 
            created_by, 
            offer_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    const values = [
        jobData.job_title,
        jobData.company_name,
        jobData.expected_minimum_salary_per_year,
        jobData.expected_maximum_salary_per_year,
        jobData.location,
        jobData.created_by,
        jobData.offer_url || null, // Default to null if offer_url is not provided
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results.rows[0].id); // Return the newly created job ID
    });
};