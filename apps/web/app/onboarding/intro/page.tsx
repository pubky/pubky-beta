'use client';

import { Typography, Button, Icon, Content, Header } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { usePubkyClientContext } from '@/contexts';
import { useRouter } from 'next/navigation';

export default function Intro() {
  const { pubky, isLoggedIn } = usePubkyClientContext();
  const router = useRouter();
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [currentIntro, setCurrentIntro] = useState(0);
  const totalIntros = 6;

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [pubky, isLoggedIn]);

  const handleNext = () => {
    if (currentIntro < totalIntros - 1) {
      setCurrentIntro((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIntro > 0) {
      setCurrentIntro((prev) => prev - 1);
    }
  };

  const introContent = [
    {
      content: (
        <>
          <Typography.Display>
            It&apos;s your web. Time to take it back.
          </Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                The internet was once a place of limitless possibility—a
                frontier for free expression, connection, and exploration.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Over time, control has shifted into the hands of a few, turning
                our digital world into a maze of algorithms and walled gardens.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                It doesn&apos;t have to be this way.
              </Typography.Body>
            </div>
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                We envision a web where you decide which content you see, who
                you connect with, and what is relevant. A place where your
                identity and data belong to you, not corporations.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                You are one step closer to a web that&apos;s truly yours.{' '}
                <span className="text-white font-bold text-opacity-100">
                  Let&apos;s unlock the web.
                </span>
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: { backgroundImage: "url('/images/intro-1.png')" },
    },
    {
      content: (
        <>
          <Typography.Display className="sm:leading-[4rem]">
            Introducing
            <br />
            Pubky.
          </Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Pubky is part of a new kind of web where you have control over
                your online identity, content, and connections.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                We believe the internet should belong to its users. So,
                we&apos;re building a decentralized web where you own your
                identity, curate your content, and connect with others on your
                own terms.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="font-bold text-white text-opacity-100"
              >
                No more walled gardens or hidden algorithms.
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: { backgroundImage: "url('/images/intro-2.png')" },
    },
    {
      content: (
        <>
          <Typography.Display>Your Digital Key.</Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Instead of usernames and passwords, Pubky uses cryptographic
                keys to secure your account. Think of it as a secret digital
                key, that only you hold.
              </Typography.Body>
            </div>
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Your key allows you to define where people can find your data,
                even if you are censored or change digital locations.{' '}
                <span className="font-bold text-white text-opacity-100">
                  In this web, you are the key.
                </span>
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: { backgroundImage: "url('/images/intro-3.png')" },
    },
    {
      content: (
        <>
          <Typography.Display>Social Tagging.</Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Use special tags to categorize posts and discover content that
                interests you.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Profile tags help you find the people, communities and
                conversations you&apos;re looking for.
              </Typography.Body>
            </div>
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                There are no algorithms deciding what&apos;s best &apos;for
                you&apos;. YOU create the algorithm with your peers.
              </Typography.Body>
              <Typography.Body
                variant="medium"
                className="font-bold text-opacity-100"
              >
                Your keys, your content, your rules.
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: {
        right: '300px',
        backgroundImage: "url('/images/intro-4.png')",
      },
    },
    {
      content: (
        <>
          <Typography.Display>Customized Feeds.</Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                You decide which content appears in your feeds. Choose the tags,
                people, reach and content types you want to see.
              </Typography.Body>
            </div>
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Save custom filter settings as new custom feeds.
                <span className="text-white text-opacity-100 font-bold">
                  You are the algorithm.
                </span>
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: {
        top: '250px',
        left: '10px',
        backgroundImage: "url('/images/intro-5.png')",
        backgroundPosition: 'left',
      },
    },
    {
      content: (
        <>
          <Typography.Display>
            Posts, Articles, Photos, Links...
          </Typography.Display>
          <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col gap-4">
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Pubky supports a growing set of content types. Use Pubky like a
                search engine, or a blog, or social media, or a forum, or for
                photo-sharing.
              </Typography.Body>
              <Typography.Body variant="medium" className="font-bold">
                Pubky is the next web.
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: {
        top: '100px',
        backgroundImage: "url('/images/intro-6.png')",
        backgroundPosition: 'left',
      },
    },
  ];

  return (
    <Content.Main className="pb-0">
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Title titleHeader={'Intro'} />
      </Header.Root>

      {/*Intro 1*/}
      <Content.Grid className="z-10 relative">
        {introContent[currentIntro].content}
        <div className="max-w-[1200px] fixed bottom-10 w-full flex justify-between items-center p-4 mx-auto">
          <div className="flex gap-4">
            <Button.Large
              icon={<Icon.ArrowLeft />}
              className="w-auto"
              variant="secondary"
              onClick={() =>
                currentIntro === 0 ? router.push('/onboarding') : handleBack()
              }
            >
              Back
            </Button.Large>
            <Button.Large
              className="w-auto"
              variant="secondary"
              onClick={() => router.push('/onboarding/sign-in')}
            >
              Skip Intro
            </Button.Large>
          </div>
          <Button.Large
            className="w-auto"
            icon={<Icon.ArrowRight />}
            onClick={() =>
              currentIntro === totalIntros - 1
                ? router.push('/onboarding/sign-in')
                : handleNext()
            }
          >
            Continue
          </Button.Large>
        </div>
      </Content.Grid>
      <div className="w-full">
        <div
          style={introContent[currentIntro].className}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
        />
      </div>
    </Content.Main>
  );
}
