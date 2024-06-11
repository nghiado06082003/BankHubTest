import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Demo = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    let [button, setButton] = useState(false);
    let [trans, setTrans] = useState("");
    const onStartClick = () => {
        axios.post("http://localhost:8080/api/connect", {
            redirectUri: "http://localhost:3000",
            userId: "6667ff4418faa991efce5b59"
        }).then(response => {
            console.log(response);
            window.location.assign(response.data.urlBankHub)
        }).catch(error => console.log(error))
    }
    const onTransactionsClick = () => {
        axios.get("http://localhost:8080/api/transactions", {
            params: {
                userId: "6667ff4418faa991efce5b59"
            }
        }).then(response => {
            console.log(response.data.transactions)
            setTrans(response.data.transactions);
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        let publicToken = searchParams.get("publicToken");
        if (publicToken) {
            console.log(publicToken)
            axios.post("http://localhost:8080/api/exchange", {
                userId: "6667ff4418faa991efce5b59",
                publicToken: publicToken
            }).then(response => {
                setButton(true);
                searchParams.delete('publicToken');
                setSearchParams(searchParams);
            }).catch(error => console.log(error))
        }
    }, [])


    return (
        <>
            <div className="container-md my-2">
                <h1 className="mx-auto">Thử nghiệm làm quen với BankHub</h1>
                <button type="button" className="btn btn-primary" onClick={onStartClick}>Liên kết ngân hàng mới</button>
                {button && (
                    <button type="button" className="btn btn-primary" onClick={onTransactionsClick}>Lấy thông tin giao dịch</button>
                )}
                {trans && (
                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Mã tham chiếu giao dịch</th>
                                        <th scope="col">Ngày giờ giao dịch thành công</th>
                                        <th scope="col">Số tiền</th>
                                        <th scope="col">Nội dung giao dịch</th>
                                        <th scope="col">Số dư sau giao dịch</th>
                                        <th scope="col">Số tài khoản</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trans.map(tr => (
                                        <tr>
                                            <th scope="row">{tr.reference}</th>
                                            <td>{tr.transactionDateTime}</td>
                                            <td>{tr.amount}</td>
                                            <td>{tr.description}</td>
                                            <td>{tr.runningBalance}</td>
                                            <td>{tr.accountNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}