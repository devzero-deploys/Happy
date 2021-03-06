import React, { useEffect, useState } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import { Sidebar } from '../../components';

import {
    MapStyle,
    Container,
    Link
} from './styles';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { MapIconMarker } from '../../utils/MapIcon';

import api from '../../services/api';

interface Orphanage {
    id: number,
    name: string, 
    latitude: number,
    longitude: number
};

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const [position, setPosition] = useState({ longitude: 0, latitude: 0, })

    useEffect(() => {
        api.get('/orphanages?filter=approved').then(resp => {
            setOrphanages(resp.data.orphanages);
        });

        navigator.geolocation.getCurrentPosition(position => {
            setPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        });
    }, []);

    return (
        <>
            <MapStyle />
            <Container id="map-container">
                <Sidebar>
                    <Sidebar.Header>
                        <Sidebar.Logo />

                        <Sidebar.Title>Escolha um orfanato no mapa</Sidebar.Title>
                        <Sidebar.SubTitle>Muitas crianças estão esperando a sua visita :)</Sidebar.SubTitle>
                    </Sidebar.Header>

                    <Sidebar.Footer>
                        <Sidebar.City>Nova Cruz</Sidebar.City>
                        <Sidebar.State>Rio Grande do Norte</Sidebar.State>
                    </Sidebar.Footer>
                </Sidebar>

                <Map
                    center={position.latitude !== 0 ? [position.latitude, position.longitude] : [-6.4847599, -35.4281936]}
                    zoom={15}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                    <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                    />

                    {orphanages.map(orphanage => (
                        <Marker
                            key={orphanage.id}
                            position={[orphanage.latitude, orphanage.longitude]}
                            icon={MapIconMarker}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} minHeight={42} maxHeight={100} className="map-popup">
                                {orphanage.name}
                        <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color="#fff" />
                                </Link>
                            </Popup>
                        </Marker>
                    ))}

                </Map>

                <Link to="/orphanages/create">
                    <FiPlus size={32} color="#fff" />
                </Link>
            </Container>
        </>
    );
};

export default OrphanagesMap;
