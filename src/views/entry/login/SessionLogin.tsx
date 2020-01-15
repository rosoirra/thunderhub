import React, { useState } from 'react';
import { useAccount } from '../../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    Input,
    CardWithTitle,
    Card,
    SubTitle,
    Wrapper,
} from '../../../components/generic/Styled';
import { LoginButton } from '../../../components/auth/Password';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { saveSessionAuth } from '../../../utils/auth';

export const SessionLogin = () => {
    const { name, admin, refreshAccount } = useAccount();
    const [pass, setPass] = useState('');

    const handleClick = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(admin, pass);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            saveSessionAuth(decrypted);
            refreshAccount();
        } catch (error) {
            toast.error('Wrong Password');
        }
    };

    return (
        <Wrapper>
            <CardWithTitle>
                <SubTitle>{`Please Login (${name}):`}</SubTitle>
                <Card>
                    <SingleLine>
                        <Sub4Title>Password:</Sub4Title>
                        <Input onChange={e => setPass(e.target.value)} />
                    </SingleLine>
                    {pass !== '' && (
                        <LoginButton
                            disabled={pass === ''}
                            enabled={pass !== ''}
                            onClick={handleClick}
                            color={'yellow'}
                        >
                            Connect
                        </LoginButton>
                    )}
                </Card>
            </CardWithTitle>
        </Wrapper>
    );
};
