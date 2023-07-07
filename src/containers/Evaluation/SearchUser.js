import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import _, { debounce } from 'lodash'
import { withTranslation, useTranslation} from "react-i18next";
import Constants from "../../commons/Constants"
import { getRequestConfigurations } from "../../commons/Utils"

const UserOption = props => {
    const { data, innerProps, innerRef } = props
    const { t } = useTranslation()
    const addDefaultSrc = ev => {
        ev.target.src = 'data:image/png;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAkGBw0PDxAODw8PEA8ODw0PDw8QDw8PDw8VFREWGBUVFRUYHSggGBolGxUVITEhKCkrMi4uFx8zODMtNygtLisBCgoKDg0OGxAQGzIlICUvLTItLTUtLS8tMC8vLS0tLS01LS8tLS0tLS0tLS0tLy8tLS0tLy0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQYEBQcDAgj/xABFEAACAgECAwUEBwUECAcAAAABAgADBAURBhIhEzFBUWEHcYGRFCIjMkKhsTNScsHRQ2KSshdTgqKzwuHwFRY1RFRVc//EABsBAQACAwEBAAAAAAAAAAAAAAADBQIEBgEH/8QANxEAAgICAAQDBQcDBAMBAAAAAAECAwQRBRIhMRNBUSIyYXGhM4GRscHR4QYU8BUjQ/E0UlNC/9oADAMBAAIRAxEAPwDuEAQBAEAQBAEAQBAEA+XrVvvKD7wDGj1Sa7Hj9Ao7+yr3/gWecq9CTxrP/Z/ie1dSr91QPcAJ7owcm+7PqDEQBAEAQBAEAQBAEAQBAJgCARAEAmAIAgCAIAgEQBAEAQBAEAmARAJgCARAJgEQBAEAQCYBEAmARAEAQCYAgCAIAgCAIAgCAIAgCAIAgEQCYAgCAIAgCAIAgCAIAgCAIAgCAIAgEQCYAgCARAJgCARAK9r/ABlg4e6s/aW+FVf1m+J7hIbL4wLPD4TkZPVLUfVlD1X2k51pIoSuhPA7Gyz59APlNWWVN9uh0WP/AE/jwW7G5P8ABFZzNZzL/wBrkWvv4FyB8hIHOT7st6sSir3IJfcYBUHqRufM9TMTZUmvMjkHkPlGhzP1MzE1LJpO9V9qfwuwHymSk12ZBZRVYtTin9xY9M9oeo0kCw13oO8OCr/Bh/STRyZrv1Ku/gOLZ7u4v4dvw/kvGg8fYOUQjk49p/DZ90n0fuM2oZEZd+hz2XwTIoXNH2o/D9i2A79R1HnJymJgCAIAgCAIAgCAIAgEQCYBEAmAIAgCAIB4ZuZVRW1trqlaDdmYgATyUlFbZJVVO2ahBbbOT8VcfX5PNVjc1NHcXBIts8/4R6TQtyHLpHsdlw/gldGp3e1L08l+5TP59SfEmaxeiAIAgCAZmBpeTkHammxx+9ykJ/i7pBdlU0/aSS+/r+BDbk1Ve/JL8/wNpfws1Ch8vJpxwe5f2ljegG43mlDiiuly0Qcvj2RqQ4krXy0wcvojVX/RF6ILbf71jLWp/wBkAn85ux8aXWWl8F1+v8G3Dxn1lpfLr9Td8NcaZOEwU724+/WpmJKD+4x32903arpQ6PqV+dwinKW10l6+vzR13RdXozKhdQ4ZT3j8SHyYeBlhCamto4rKxbMazksWv1M+ZmuIAgCAIAgCAIAgEQCYBEAmAIAgCAY+dl10VvdawWutSzMfAATyUlFbZJVVK2ahBbbOJ8W8TXahbv1XHQ/ZVf8AM3mZWW2ub+B33DuHQw4esn3f6I0MiLEQBAEAydOwLsmwVUqWY9/7qjzY+AkN+RXRDnsekRXXwphzzekdB0TgzGo2e77a316VqfQePxnK5nGrrdxr9mP1ObyuLW2+zX7K+plcT66mDUFQA3ONqk6BVH7xHkOsh4dgSy7Nyfsru/0IcHCeVPcvdXd/ocwy8my5zZaxd272P6DyE7OuqFUVCC0kdZXXGuPLBaR5TMzEA2Wga1fg3C6k+QsrP3bF8j6+szrm4PaNXMw68qvkn9z9Dt+g6xTm0LfUejdGU/eRh0KmWcJqa2j5/l4k8W11z/7NjMzWEAQBAEAQBAEAQCIAgEwBAEAiAch9pHEn0m76LU32FBIcjussB/QbSvyLeZ8q7HbcD4f4FfjTXtS7fBfyUyaxeiAIAgHth4z3WJTWN3sYKo/n8B1kdtsaoOcuyMLbI1wc5dkda0LSKsOkVJ1Y7Gxz3u3j8JwubmTyrOeXbyXojjcvKnkWc0vuXobGahqnHuIc85OVbae7m5E9FXoP5zv8GhUURgvm/mztsOlU0Rh97+bNfNo2RAEAQDfcGcQtgZIYn7C36ty+ng49R+klps5JfAruJ4Cy6dL3l2/Y7lW4YBlO6sAQR3EHulofPmnF6Z9QeCAIAgCAIAgCAIBEAmAIAgFd471r6Hhuyn7Wz7Or3t0J+A6yG+fJEs+E4f8Ac5CT91dX/nxOH/8AZPnKw+gCAIAgCAXP2b4IZ7ckjrX9knoSN2PyM57j97UY1Lz6so+N3NRjUvPqy/TlznT4v+4/8D/5TMq/eXzR7H3l8ziPn7z+s+jneiAIAgCAIB1n2Wa2bsdsVzvZjfd3PVqz3fLum/jT3HlfkcZ/UGGqrldHtLv8y8zaOfEAQBAEAQBAIgCAIBMAQBAOQe1XUjbmrQD9THrG4/vuTv8AkFlflS3PXodt/T+PyYzsfeT+iKZNYvRAEAQBAOlezpAMInxa+0n4BR/Kcfx5t5WvSK/U5bjT3k6+CLPKYqhtv08+kb0Di2o45qutrP4LHH57ifRKLPEqjNeaR3VM+euMvVGPJSQQBAEAQDe8D6kcbUKH32Swmmz1DA7f73LJaZcs0V/FcdXYk15rqvu/g7pLQ+eEwBAEAQBAEAiATAIgEwBAEA/PWt5Zvyr7j157XI92+w/SVE3uTZ9MxavCohD0RhATEnM1dIyyNxj2keYUkTXeXQnpzX4kDyqE9OaPG3DvT79Vq++tgP0kkbq5e7JP70Zxtrl7sl+Jj7yQlJg8Ojeze7fEsTxrvf5Mqn+s5Lj8NZEZesV+bOY41HV6l6r9y1yjKgQDmntAwjXl9qB9W9Fb/aG4b9BOx4Jfz43J5xf08jqeD3c9HL5xf0KzLgtRAEAQBAJVypDDvUhh8DvAa2tM/Q2k5Pa49Fvf2lNT/NQZbxe4pnzLIr8O2UPRtfUy5kQiAIAgCAIAgEQBAJgCAeOY/LVY3kjn5KZ4+xnWtzS+KPzih3APn1lOfUWtPR9QeGXhapk0Heq6xfTmJX5GQXYtNy1OKZDbjVWrU4pls0rjvfZMusEd3aIN/mhlHk8B17WPL7n+5T5HBte1S/uf7m/fS9Mzk7RUqcH+0qIVl9+3cffKtZWbhy5W2vg+xWrJy8WXK218GVfWeBra93xmNq9/ZsALB7j+KXWJxyufs3Llfr5fwW+NxiE/ZtWn6+RPs8yzXkWYzgqbV3CsCrcyjqNj47TzjtSsojbHrr8mecZq56o2x66/JnQpyhzYgFc480/tsRnUbvjkWDz5dwG/Lc/CW/BcjwslRfaXT9iz4Tf4eQovtLp+xzGdkdWIAgCAIBBgHduBXLaZhk/6hB8un8paU/Zo+e8WWs2z5m9kpXCAIAgCAIAgEQBAJgCAeGcu9Vg867B/umeS7ElT1ZF/FH5yrHQDyEpz6hLufUHggCAZWnajfjOLKXKHcbjvVvRh4iQ349d8eWxbRFdRXdHlsWzpHDXE1WYORtq7wOqb9G9U8/dOQ4hwyeK+ZdY+vp8zls7h88d8y6x9f3MvU9GrtsTIQBMmkhksH4tu9WHiCNx8ZBjZs64OqXWD7r9URUZcq4uuXWD7r9jZqeg36HxHlNJ9zUZMA+bEDKVbqGBUj0I2nsZOLUl5Hqbi9o41qmGaL7aT/ZuwHqp6r+RE+hY1yuqjYvNf9ncY9qtqjNea/wCzFkxKIAgCADAO58BrtpmH60qfmSZaUfZo+e8Xe82z5m/kpXCAIAgCAIBEAmARAJgCAQRAPzvqeMab7qj0Ndjr+cqJLTaPp1FisqjNeaRjTElEAQBAPqqxkYOhKspDKw7wR4zyUVJOMltM8lFSTT7M61wzqn0vGW07BwSlgHdzL4/IgzhOI4v9te4Lt3XyONzsb+3ucF27r5G1mkaggCAc79pGJy31XAftayre9T/QzrOAW81Mq35P8zpeCW81UoPyf5lSl6XIgCAIA236DvOwHxgb11P0HoON2OJj1f6uilT7wg3lvBaikfNMuzxL5z9W/wAzPmRriAIAgCAIBEAQBAJgCAIBxn2m6eac8uBsmRWtgPhzAkMP8p+MrsmOp79TuuA3+JicvnF6+7yKnNcuRAEA9MdaywFjMinvZRzEfDxmE3JR3BbZjNyS9lbZatK4QxsgcyZy2DxWtVDj3g9RKTJ4vdQ9Sp18+xT5HFLaekqtfPsXjStOqxahTUCFBJ6ncsT3knznN5OTPIs8Sfcob753z559zLkBCIAgFL9phHZ44/FzuR57bTov6eT55vy0i84Gnzz+SKFOnOiEAQBANtwnp5yc7Hp23Bfnf0VAWO/xAHxklUeaaRp8RvVGNOfw0vm+h3sCWp84JgCAIAgCAIBEAmARAJgCAIBUvaTopycM2IN7cb7RfMr+MfKa+RDmjteRc8Dy1Rkcsn7Mun7HGQZXHdGaml3tSMhEL1lyh5PrMrDzE13lVRs8KT09b6kDya42eHJ6etnnnYNtDKlq8jsgcISCwBJA38u4zOm+Fycq3tJ62ZVXQtTcHtLpsx5KSn3Ta6NzIzIw7mU7GYyhGa1JbR5KMZLUltFi03jbNq2FnLev94BX+YlTfwTHs6w9l/QrL+EUWdYey/oWPC46w32FgspPqvMvzEqbuBZEfcal9Crt4NfH3GmbajiDBfquTV8WAM0J8Oyo962acsHIj3gzzzeJcClSTejEdyVnnY+4CZ08MyrHpQa+L6Iyq4fkWPSi18znPEWsvm3doRyoo5a0/dHmfUzrcHCji1ci6t92dPhYkcavlXV+bNXN02z2w8V7rFqrG7tzcq77b7Anb37AyO22NUHOfZGFlka4ucuyMhdIyeS2xq2RKATYzgr18h5mRPLp5oxUtuXbRE8qrmjFPbl20YM2TYOneybRiqWZzjrZvXT/AADbc/E/pN3Fh05jk/6iy9yWPHy6v5nRJuHMCAIAgCAIAgCAIAgCAIAgEMAeh7j0MDscT464dOFk7qCMe9i9bd4Q7/WX4b7ysvr5H0O+4Tn/AN1Tp+9Hv8fRlj4IysFa2ootdnG9tpsUr6EjcbbCcXxirJlNWWxSXZa6lZxSvIlNWWRSXZaKvxhk4d930jHvLswVXrZLBtt4qSANvSXXCq8imvwrYaS7Pa+vUt+G131V+HZHS8ntfUr8tCxPWzGsVEsZSEt5uQn8Wx2JHpMI2RlJxT6ruYRsjKTin1Xc8pmZiARtB6AJ6eHrVQ78xRS3Ipd9vBfEzCU4x1zPv0RjKcY65n36I8t5kZG14c+jrelt9/YrUwYbKzM58ANgdhNLP8WVLhVDmb6fBGpm+K6nCuPM2X/iTUcF8Qdta3ZZQ+zasMWJHUEbD9Zy/D8fKjkf7cfah33/AJ+RzmFRkRv/ANuPtR77KFoWiHNyxj0lmr3LNaV5StY7yfI+E7emErNJrT8zosvMWLR4s+/p8Tu2HjJTWlVY2StQqjyAlskktI+d2WSsm5y7s9p6YCAIAgCAIAgEQBAEAmAIAgCAa/XNJpzKHotG4YHlb8SN4MPUTCcFNaZs4mVPGtVkPL6/A4pqmn5emZD1tupZHRbQPq2o3eQfP08JUX46fszW9Pa+473HvpzqlNdevVejRqAJ6bpauAaO1e6uypLMflBc2KCEbw2J8xKTjU/DjGUJNT8teaKji8+SMZRk1Ly16G644w8I11drd2D1qwpRV5gw8uUeEr+D3ZKnLkjzJ923+po8KtvUpckeZPu/5OdmdWdKbjRuHMnK5HQIai6h27ReZRv9bde/faaGXxGnH3GW+bXTp39Opo5OfVRuMt7106GdxJwtfVbZZSi/RtlYMXReT6o3B3PmD85rYHFK7K4xsft/J9epBhcSrshGM37fyfUrMuC1L1wHgYoLWLkLba1fK9PLy8qnv3B75zXGsi/Si4ain0Zz/FrrmlFw0k+jMbjzCrx0qSjHSuuxiz2KvVm67Jv4efwk3Brp3ylKybbXZfD1JeE2yulKVk22uy/Up0vy7M7Erycs04lYawqWFajuQMdySfACY10rncorrLua9kqsdSul09Ts/CPDlen0BBs1z9brNurHyHoO74S2qqUFo4TiOfPMt5u0V2X+eZvZKV4gCAIAgCAIAgCAIAgCAIAgCAIBrdc0XHzajTem471YHZ0PgVImE4Ka0zaxMy3Fnz1v9mcd4m4UysBiWHaUfhuXuHow8D+UrrKZQ+R3GBxOnLWl0l6fsaRb3C8odgpO/KrEA+vSQOEW+Zrqb7hFvbXUyc/Urb1pW08xoVkDHvIJ3G/u7pDTjQplJw6cz2RU48KpScP/ANGHNgnN7wlq1eG911hY/ZhUqXf7Rtz3+HTp1lZxPEnlRjXD16v0RX8Qxp5EYwj69X6IyuKtfrzaKShatkci2knoeh2bp0IkPDeHyxLZKWmmuj/T4EWBhSxrZc3VNdGViXJambpOp2YrO9f33qasH93f8U18nGhkRUZ9k9kGRjxvSjLsns8bM29lNbWuyE8xVjzDffffr3SRU1xlzKKTM1TXGXMopMzNB0HKzn5KE3Xf69rdK0958T6CTwrlN9CDLzacWPNY/kvNnYuF+GMfT69kHNcwHa3HqzHyHkPQSxrqUF0OHz+I25kva6RXZG9kpXiAIAgCAIAgCAIBEAQBAJgCAIAgCAIB82VqwKsAykbEEbg++D2MnF7RSNf9nGNcTZiscew7nk76WPu/D8Jq2Y0X1j0L/D/qC6tcty5l6+f8lD1ThDUsYnnx2dB/aVFbFPwB3HymrKmcfI6PH4riXe7PT9H0/g0bqVOzAqfJgVP5yIsE0+qI3gCAB16DqfIdTA7G203hrUMnbssawg7fXflrQeu7EflJI1Tl2Rp38Rxaffmvl3f0LxoXszrUh8yztCOvY1nlr+J7zNmGKu8jn8v+opP2aFr4vuX7Exa6UFdSKiL3KoAAm2kktI5uyydkuab2z2npgIAgCAIAgCAIAgCARAJgCAIAgCAIAgCAIAgEQDFytLxrf2tFL7/vVox+e0xcIvuiavJur9yTX3s1tnB+lN34dPwBH6TDwa/Q2lxXMX/IyE4N0of+zq+IJ/nHg1+h6+LZj/5GZ+Lo2HV+zxqE9RWm/wA9pmoRXZGtZl32e/Nv72ZwEyNcmAIAgCAIAgCAIAgCAIAgCARAEA53xzxPqeBlCutq+xtQPVvWpPQ7MCfTp85p3WzhLp2On4Tw7Ey6OaSfMnp9fwPXgHi7KzMl6cl0I7MNWFQLuQevX3bT2i6U5akYcY4XTjUqdSffr1L+SB1PcO+bZzZQuD+I9Rz8yxeev6LSWLEVgMwJPIAZqVWznL4HR8SwMXEx09Pnfx/Ev02znBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAIgEwCl+1PTDdhi9Ru+M3P68h2Df1+E1smG479C9/p/I8PJ8N9pdPv8jmPD+onFyqMgdyWJz+qEgP8AlvNKuXLJM63Mx1fROt+a6fPyOucd60uNgO6sOa8dnUf4h1PylhfPlgcVwjDd+UotdI9X9xreC9I+j6RYxBV8hLLmIJDAcmyjfw6Df4yOmHLU/ibfFMrxuIRS7RaX16lK4Iz8i3PxUsvuZS+5U2MQdhuNx75r0ybmtsvuK0VQxbHGCT16GTxa2YM7P7G64V4/Z2OotYBQyjcgeW89t5ueWn2IuHKh41PiRW5bS6ehuPZdxC7WWYd9jObN7KWcljuB9Zdz6DeSY1j3ys0eP4EVBX1rWuj19GZGj5ltedrTc7sMWp3qVnZlU8rN3H1AmVbfPI186EXh4/RJy79Pkcz0LO1HUs6qh869GyHbmcOwC7Anoo6TyLcnrZ7bCqmtyUV0Oh/6Ocr/AO6yf8f/AFk3hv1K7+9j/wDNHn7UPpGJpeGq5NjW1OtbXo5VrOmxJ2755ZtRR7hctl0unT0KzwHpGZqi3M2p5NPYsqgdoTzbjfxMwgnLzNrLshS1qCezU6Zr+oYmoKi5dtgTJWpudy6WKX5TuD6GYqTUu5LOmuyrfLrobP2m8UZzajdjpfZVVjlEVK25ASUDEkjqe/8AKZWTfNojwsevwlJrbZstd4Uz8XTjn/8AimS5Wuuw18zgHm26A7+s9lBqO9kVWRXO3w+RHp7JeIMq9srDuussT6O9qM7Euh7js3fPapN7TPM+iEVGcV5lV4W1PLs1LFpfKyGrOUFKm59iFY7A9fQSOLfMbV9cFS2kux+gdaXfGv6kfY2dQSCPqnuM232Ofr99HLtAyrn4Xy72uuN3M7dqbH5wVsUDY77joJBF/wC3stLYpZkY66FV4IpztTyvop1DJq+yezmFjN3EdNt/WYQ3J62beS66Yc3Kjz4ss1DS82zGXPyLDUtbq5dvxIG6g9PGeS3F62e46rurUnFdTvPDGZZfhY19h3stordyOm5K9TNqL2ihuio2OK9TZzIiEAQBAIgEwBAPHKx1trethutispB8iJ41taM65uElJd0fnrUMNqLbaGHWp3rO/oen5SolHTaPplNqtrjYvNbN+mVbqr6dgnfaoFbT5jm+s3+Dp8ZNt2uMSudcOHxuyF59v2/Hqde1GtVxbVUAKtLgAdwAUywktRZxFEnK+LfqvzOMez//ANRxP4m/ymVtH2iO84x/4dn+eZeNKx0t1nVanG62UVIQfEFQDNmKTtkmc9kWSr4djzj3TZzy6q7Ts3bqLMW1WU93MB/IjpNRp1z+R08ZQzcbflJf5+DLboOUt9uu3p927ELj41PuPnvNqp7lNlBxOp1Y+NXLum19Uc64ARW1HGR35Fs7VC+4HLzVkb7+c8r95GGXvwpNGb7QNLTT8qujHyrrUbHW1mNzEhi7jbofJRMrFyvSI8Sfi180lrqbbXiTw1p5JJJvYkkkknmPeTPZfZohq6Zcvkajhbht8zCzsiq21LsXZkrQkLYAu5B2PfMYx2mya+9V2Ri10Zh8B0Yt2o4yZRYVvYCpB2HOPrKGPkSAPjPIacupJlOcapOJ7e0cbavm/wD61/8ADSe2e8zHD+widU42y6ToDgW1knHoAAdSSfq9AJPN+wVONGX9yunmUP2OAnNydv8A4Vv6iRU9yw4j9nH5lf4RYJquKXIULlnmLHYD6zd/lMIe8bGR1olr0P0NrGbR9Gv+1q/Y2/2i/un1m22tHO1wlzrocw4bB/8AKeX6m7/irIY/ZstLv/Nj/nkVD2fafl5OZ2WHlfRbuxdu125vqgjddpHWm30NzLnCFe5ra2XTM9kmdk2m7J1JbHfbnc1MXIAAG3XbuEkdLb6s0o8SrhHljA6ppWCuNRVjoSVprStSe8gDbeTpaWipnNzk5PzMqemIgCAIBEAQBAJgFY1jgbAy7myLBYHfbm5LGUHbx2kE8eEntltjcZycetVw1pfA9dB4NwsG030hy/KU3dy2wJG+2/untdEYPaMMvi2RlV+HPWu/RG9yqBZW9ZJAdWUkd4BG3SStbWivrm4SUl5FX0vgDCxrq76mu56mDLvYSPcR5SCONGL2i2yOOZF9cq5pafwNphcO01ZducrWG24bOC26EdNunptJFUlJyNS3Pssx447S5Y9vUxeIODcLOtF9vOtgQISjleYAkjf5mY2URm9slw+LX4sPDhrW99UfegcI4mCbey52F6hHFjcwIG/T8zPa6Yw3oxzeKXZaip66dtGhu9kuklyy9ugJ3Cra2y+7ePBiYriN2tMN7JdKK7E5BbfftDcxbb93y2jwYhcRtXobDJ9n+FZh04DPd2OO7Omz7MSfM+k9da1ojjmTVjsXdmZwtwfi6aLVoaxlu251sbmB26fpPYwUexhfkzu1zeRpD7J9L7TtFbIRufnXlsICnfcbfGY+DEn/ANRt1p6NhxB7PdOzrFuuFgtCKjWI5U2BRsCw7ifWeyrTI6s2ypaj2NYfZJpm23aZW3l2x2+U88GJL/qNvfSLBwtwfg6aH+jqxezo9jsWcjwX0EyjBR7Gvfk2Xe8abUvZbpV9z3bW1mxi7LXYQvMTuSB4dZi6otk0OIWxjynj/om03xsyiPEds2xjwke/6hZ6Ist/DOI2AdNRTVjFFTZDs2wYE9T13JHUzPlWtGsr5+J4j6s1fDfs+wdPyBk0PdzhWTZn5lIPeCPhMY1qL2iW7MnbHlkW6SGoIAgCAIAgEQCYAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgEQCYAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCARAEAmAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgEQBAJgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIBEAmAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAf/9k='
    }
    
    return (
        <div ref={innerRef} {...innerProps} className="user-option">
            <div className='user-info'>
                <div className='avatar'>
                    <img src={`data:image/png;base64,${data.avatar}`} onError={addDefaultSrc} alt="avatar" />
                </div>
                <div className='main-info'>
                    <div className="full-name">{data.label}</div>
                    <div className="other-info"><span className='account'>({data.account})</span><span className='title'>{data.current_position}</span></div>
                </div>
            </div>
        </div>
    )
}

class SearchUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            users: [],
            userTyping: "",
            isSearching: false
        }
        this.onInputChange = debounce(this.searchUserInfos, Constants.TIME_DEBOUNCE_FOR_SEARCH)
    }

    handleSelectChange = (name, value) => {
        this.setState({[name]: value})
        this.props.updateUser(value)
    }

    searchUserInfos = (value) => {
        this.setState({isSearching: false})
        if (value !== "") {
            this.setState({isSearching: true})
            const config = getRequestConfigurations()
            const payload = {
                account: value,
                employee_type: "EMPLOYEE",
                status: Constants.statusUserActiveMulesoft
            }
            axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    const data = res.data.data || []
                    const users = data.map(res => {
                        return {
                            value: res?.uid,
                            label: res?.fullname,
                            account: res?.username,
                            avatar: res.avatar,
                            current_position: res.position_name
                        }
                        // return {
                        //     value: res.username,
                        //     label: res.fullname,
                        //     uid: res.uid,
                        //     fullName: res.fullname,
                        //     avatar: res.avatar,
                        //     employeeLevel: res.rank_title || res.rank,
                        //     pnl: res.pnl,
                        //     orglv2Id: res.organization_lv2,
                        //     account: res.username,
                        //     current_position: res.position_name,
                        //     department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
                        // }
                    })
                    this.setState({ users: users })
                }
            })
        } else {
            if (Array.isArray(this.state.users) && this.state.users.length > 1) this.setState({isSearching: true})
        }
    }

    onInputChange = value => {
        this.setState({ userTyping: value }, () => {
            this.onInputChange(value)
        })
    }

    filterOption = (option, inputValue) => {
        const { users } = this.state
        const options = (users || []).filter(opt => (opt.label?.includes(inputValue) || opt.value?.includes(inputValue) || opt.uid?.includes(inputValue)))
        return options
    }

    render() {
        const customStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
                height: 35,
                minHeight: 35
            })
        }
        const { t, title } = this.props
        const { isSearching, user, users } = this.state

        return <Select
                    isClearable={true}
                    // styles={customStyles}
                    components={{ Option: e => UserOption({...e, isSearching: isSearching})}}
                    onInputChange={this.onInputChange.bind(this)}
                    onChange={userItem => this.handleSelectChange('user', userItem)}
                    value={user}
                    placeholder={t('SearchTextPlaceholder')}
                    filterOption={this.filterOption}
                    options={users}
                />
    }
}

export default withTranslation()(SearchUser)
