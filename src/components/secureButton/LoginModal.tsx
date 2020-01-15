import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import {
    SingleLine,
    Sub4Title,
    Input,
    NoWrapTitle,
    ColorButton,
    SubTitle,
} from '../../components/generic/Styled';
import { LoginButton } from '../../components/auth/Password';
import { Circle, ChevronRight } from '../generic/Icons';
import styled from 'styled-components';
import { useAccount } from '../../context/AccountContext';
import { getAuthString, saveSessionAuth } from '../../utils/auth';
import { useSettings } from '../../context/SettingsContext';
import { textColorMap } from '../../styles/Themes';

const RadioText = styled.div`
    margin-left: 10px;
`;

const ButtonRow = styled.div`
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface LoginProps {
    macaroon: string;
    color: string;
    callback: any;
    variables: {};
    setModalOpen: (value: boolean) => void;
}

export const LoginModal = ({
    macaroon,
    color,
    setModalOpen,
    callback,
    variables,
}: LoginProps) => {
    const { theme } = useSettings();
    const [pass, setPass] = useState<string>('');
    const [storeSession, setStoreSession] = useState<boolean>(false);
    const { host, cert, refreshAccount } = useAccount();

    const handleClick = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(macaroon, pass);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (storeSession) {
                saveSessionAuth(decrypted);
                refreshAccount();
            }
            const auth = getAuthString(host, decrypted, cert);
            callback({ variables: { ...variables, auth } });
            setModalOpen(false);
        } catch (error) {
            toast.error('Wrong Password');
        }
    };

    const renderButton = (
        onClick: () => void,
        text: string,
        selected: boolean,
    ) => (
        <ColorButton color={color} onClick={onClick}>
            <Circle
                size={'10px'}
                fillcolor={selected ? textColorMap[theme] : ''}
            />
            <RadioText>{text}</RadioText>
        </ColorButton>
    );

    return (
        <>
            <SubTitle>Unlock your Account</SubTitle>
            <SingleLine>
                <Sub4Title>Password:</Sub4Title>
                <Input onChange={e => setPass(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <NoWrapTitle>Don't ask me again this session:</NoWrapTitle>
                <ButtonRow>
                    {renderButton(
                        () => setStoreSession(true),
                        'Yes',
                        storeSession,
                    )}
                    {renderButton(
                        () => setStoreSession(false),
                        'No',
                        !storeSession,
                    )}
                </ButtonRow>
            </SingleLine>
            {pass !== '' && (
                <LoginButton
                    disabled={pass === ''}
                    enabled={pass !== ''}
                    onClick={handleClick}
                    color={color}
                >
                    Unlock
                    <ChevronRight />
                </LoginButton>
            )}
        </>
    );
};
