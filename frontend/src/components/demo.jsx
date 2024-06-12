import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Demo = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    let [button, setButton] = useState(false);
    let [trans, setTrans] = useState("");
    let [connectNoti, setConnectNoti] = useState(null);
    let [transNoti, setTransNoti] = useState(null);
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
        setTransNoti(<p>Đang tải...</p>)
        axios.get("http://localhost:8080/api/transactions", {
            params: {
                userId: "6667ff4418faa991efce5b59"
            }
        }).then(response => {
            console.log(response.data.transactions)
            setTrans(response.data.transactions);
            setTransNoti(<p className="text-success">Lấy thông tin thành công</p>)
        }).catch(error => {
            console.log(error)
            setTransNoti(<p className="text-danger">Lấy thông tin thất bại. Mã lỗi: {error.response.data.status}</p>)
        })
    }

    useEffect(() => {
        let publicToken = searchParams.get("publicToken");
        if (publicToken) {
            console.log(publicToken)
            setConnectNoti(<p>Đang liên kết...</p>)
            axios.post("http://localhost:8080/api/exchange", {
                userId: "6667ff4418faa991efce5b59",
                publicToken: publicToken
            }).then(response => {
                setButton(true);
                searchParams.delete('publicToken');
                setSearchParams(searchParams);
                setConnectNoti(<p className="text-success">Liên kết thành công</p>)
            }).catch(error => {
                console.log(error)
                setConnectNoti(<p className="text-danger">Liên kết thất bại. Mã lỗi: {error.response.data.status}</p>)
            })
        }
    }, [])


    return (
        <>
            <div className="container-md my-2">
                <h1 className="mx-auto">Thử nghiệm làm quen với BankHub</h1>
                <div className="row">
                    <div className="col">
                        <h5>Bước 1: Kết nối ngân hàng</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={onStartClick}>Liên kết ngân hàng mới</button>
                        {connectNoti}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h5>Bước 2: Lấy thông tin giao dịch</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={onTransactionsClick}>Lấy thông tin giao dịch</button>
                        {transNoti}
                    </div>
                </div>
                {trans && (
                    <div className="row">
                        <div className="col">
                            <table className="table table-striped table-hover table-bordered">
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