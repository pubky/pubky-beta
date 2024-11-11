'use client';

import { Typography, Button, Icon, Content, Header } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Intro() {
  const router = useRouter();
  const [currentIntro, setCurrentIntro] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [largeScreen, setLargeScreen] = useState(false);
  const totalIntros = 7;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    const checkSmallScreen = () => {
      setSmallScreen(window.innerWidth < 1280);
    };
    const checkLargeScreen = () => {
      setLargeScreen(window.innerWidth < 1500);
    };

    checkMobile();
    checkSmallScreen();
    checkLargeScreen();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', checkSmallScreen);
    window.addEventListener('resize', checkLargeScreen);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', checkSmallScreen);
      window.removeEventListener('resize', checkLargeScreen);
    };
  }, []);

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
            It&apos;s your web. Take it back.
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
      className: {
        marginTop: isMobile ? '300px' : '',
        backgroundImage: isMobile
          ? "url('/images/webp/intro-1-mobile.webp')"
          : "url('/images/webp/intro-1.webp')",
      },
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
            <div className="flex flex-col gap-4 mt-2">
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
      className: {
        marginTop: isMobile ? '300px' : '',
        marginLeft: isMobile ? '-150px' : '',
        backgroundImage: isMobile
          ? "url('/images/webp/intro-2.webp')"
          : "url('/images/webp/intro-2.webp')",
      },
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
                className="text-opacity-80 leading-snug tracking-normal"
              >
                Your key allows you to define where people can find your data,
                even if you are censored or change digital locations.{' '}
                <span className="font-bold text-white text-opacity-100 tracking-normal">
                  In this web, you are the key.
                </span>
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: {
        backgroundImage: isMobile
          ? "url('/images/webp/intro-3-mobile.webp')"
          : "url('/images/webp/intro-3.webp')",
      },
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
        right: isMobile ? '0px' : '300px',
        top: isMobile ? '100px' : '',
        backgroundImage: isMobile
          ? "url('/images/webp/intro-4-mobile.webp')"
          : "url('/images/webp/intro-4.webp')",
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
                <br />
                <span className="text-white text-opacity-100 font-bold">
                  You are the algorithm.
                </span>
              </Typography.Body>
            </div>
          </div>
        </>
      ),
      className: {
        marginTop: isMobile ? '350px' : '250px',
        left: smallScreen ? '50px' : '200px',
        backgroundImage: isMobile
          ? "url('/images/webp/intro-5-mobile.webp')"
          : "url('/images/webp/intro-5.webp')",
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
        top: isMobile ? '200px' : '100px',
        left:
          largeScreen && !smallScreen
            ? '-200px'
            : smallScreen && !isMobile
            ? '-220px'
            : '',
        backgroundImage: isMobile
          ? "url('/images/webp/intro-6-mobile.webp')"
          : "url('/images/webp/intro-6.webp')",
        backgroundPosition: 'left',
      },
    },
    {
      content: (
        <div className="lg:h-[50vh] flex items-center justify-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Typography.Display>Coming Soon</Typography.Display>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 leading-snug"
              >
                Pubky is currently in private beta and will open up
                <br /> to more users soon.
              </Typography.Body>
            </div>
            <Typography.Body variant="medium" className="font-bold">
              Learn more about Pubky:
            </Typography.Body>
            <div className="relative flex gap-3">
              <Link target="_blank" href="https://pubky.org">
                <Button.Large>Knowledge Base</Button.Large>
              </Link>
              <Button.Large
                onClick={() =>
                  window.open('https://medium.com/@synonym_to', '_blank')
                }
                variant="secondary"
                className="w-auto"
              >
                Blog
              </Button.Large>
            </div>
          </div>
        </div>
      ),
      className: {
        backgroundImage: isMobile
          ? "url('/images/webp/intro-7-mobile.webp')"
          : "url('/images/webp/intro-7.webp')",
      },
    },
  ];

  return (
    <Content.Main className="pb-0 md:pt-[150px] pt-[120px]">
      <Header.Root className="backdrop-blur-[0px]">
        <div className="flex gap-3 lg:gap-6 items-center lg:items-start">
          <Header.Logo link="/" />
          <Header.Title className="mt-[1px]" titleHeader="Sneak&#160;Peek" />
        </div>
        <div className="h-6 justify-start items-start gap-6 inline-flex">
          <Link
            target="_blank"
            href="https://github.com/pubky"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Github size="24" />
          </Link>
          <Link
            target="_blank"
            href="https://x.com/getpubky"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Twitter size="24" />
          </Link>
          <Link
            target="_blank"
            href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Youtube width="24" height="24" />
          </Link>
        </div>
      </Header.Root>

      {/*Bg images*/}
      <div className="w-full">
        <div
          style={introContent[currentIntro].className}
          className="fixed inset-0 bg-cover bg-center pointer-events-none"
        />
      </div>

      {/*Intros*/}
      <Content.Grid className="z-10 relative flex flex-col justify-between min-w-screen min-h-[80vh]">
        {introContent[currentIntro].content}
        <div className="grow"></div>
        <div className="absolute bottom-5 xl:bottom-10 w-full flex justify-between items-center mx-auto mt-6">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-auto"
            variant="secondary"
            onClick={() =>
              currentIntro === 0 ? router.push('/') : handleBack()
            }
          >
            Back
          </Button.Large>
          {currentIntro !== totalIntros - 1 && (
            <Button.Large
              className="w-auto"
              icon={
                currentIntro === totalIntros - 1 ? (
                  <Icon.Check />
                ) : (
                  <Icon.ArrowRight />
                )
              }
              onClick={() =>
                currentIntro === totalIntros - 1
                  ? router.push('/')
                  : handleNext()
              }
            >
              {currentIntro === totalIntros - 1 ? "Can't Wait!" : 'Continue'}
            </Button.Large>
          )}
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
