import React from 'react'

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      {/* <span>
        <i
          style={{ color }}
          className={
            value >= 1
              ? 'fas fa-star'
              : value >= 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 2
              ? 'fas fa-star'
              : value >= 1.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 3
              ? 'fas fa-star'
              : value >= 2.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 4
              ? 'fas fa-star'
              : value >= 3.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color }}
          className={
            value >= 5
              ? 'fas fa-star'
              : value >= 4.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
      <span>{text && text}</span> */}
          <span>
        {[...Array(5)].map((_, i) => {
            const cls = value >= i + 1
                ? 'fas fa-star'                 //full star
                : value >= i + .5
                    ? 'fas fa-star-half-alt'    //half star
                    : 'far fa-star'             //empty star
            return <i key={'Star' + i} style={{ color }} className={cls} />
        })}
    </span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#f8e825',
}

export default Rating