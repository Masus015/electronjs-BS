'use client';

import styles from "./page.module.css";
import TitleBar from "@/components/app/TitleBar/TitleBar";
import Menu from "@/components/app/Menu/Menu";
import Page from '@/components/app/Page/Page';
import AutoUpdater from '@/components/updater/updater'
import useStore from "@/utils/useStore";
import { useEffect, useState } from "react";
import {dayzServerList} from '@/utils/api'

export default function Home() {
  const setDayzServers = useStore((state) => state.setDayzServers);


  useEffect(() => {

    const fetchDayzServers = async () => {
      // const data = await dayzServerList();
      const data = {
        "official": [
          {
            "name": "Goled",
            "online": 123,
            "ip": "https://google.com/"
          },
          {
            "name": "Wikipedia",
            "online": 99,
            "ip": "https://wikipedia.org/"
          }
        ],
        "unofficial": [
          {
            "name": "GitHub",
            "online": 321,
            "ip": "https://github.com/"
          },
          {
            "name": "Stack Overflow",
            "online": 42,
            "ip": "https://stackoverflow.com/"
          },
          {
            "name": "Reddit",
            "online": 88,
            "ip": "https://reddit.com/"
          },
          {
            "name": "Mozilla",
            "online": 12,
            "ip": "https://mozilla.org/"
          },
          {
            "name": "Twitter",
            "online": 5,
            "ip": "https://twitter.com/"
          },
          {
            "name": "Facebook",
            "online": 7,
            "ip": "https://facebook.com/"
          },
          {
            "name": "YouTube",
            "online": 100,
            "ip": "https://youtube.com/"
          },
          {
            "name": "Amazon",
            "online": 15,
            "ip": "https://amazon.com/"
          },
          {
            "name": "Microsoft",
            "online": 20,
            "ip": "https://microsoft.com/"
          },
          {
            "name": "Apple",
            "online": 10,
            "ip": "https://apple.com/"
          }
        ]
      };
      setDayzServers(data);
    };

    fetchDayzServers();
    const intervalId = setInterval(fetchDayzServers, 10000);

    return () => clearInterval(intervalId);
  }, [setDayzServers]);

  return (
    <div className={styles.container}>
      <AutoUpdater />

          <TitleBar />
          <Menu />
          <Page />
    </div>
  );
}

// ДОБАВИТЬ ЗУКИ В DAYZ, СОЗДАТЬ НАСТРОЙКИ(ЯЗЫК, ЗВУК ИНТЕРФЕЙСА), ВОЗМОЖНО РАЗРАБОТАТЬ ОКНО ПРОВЕРКИ ОБНОВЛЕНИЙ