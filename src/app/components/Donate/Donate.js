import React from 'react';
import { payPalURL, devEmailAddress } from 'misc/constants';

const Donate = () => {
    return (
        <div className="paypal">
            <form action = { payPalURL } method="post">
                <input type="hidden" name="business"
                    value = { devEmailAddress }></input>

                <input type="hidden" name="cmd" value="_donations"></input>

                <input type="hidden" name="item_name" value="React Sample"></input>
                <input type="hidden" name="item_number" value="0001"></input>
                <input type="hidden" name="currency_code" value="USD"></input>

                <input type="image" name="submit"
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
                alt="Donate"></input>
                <img alt="" width="1" height="1"
                src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" />

            </form>
        </div>
    )
}

export default Donate;