'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from 'lucide-react'

const useMouseParallax = (strength: number = 0.1) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    x.set((mousePosition.x - window.innerWidth / 2) * strength)
    y.set((mousePosition.y - window.innerHeight / 2) * strength)
  }, [mousePosition, strength])

  return { x, y }
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; color: string; velocity: { x: number; y: number } }[] = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        }
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
    }

    animate()

    return () => cancelAnimationFrame(animate as unknown as number)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const raindrops: { x: number; y: number; length: number; speed: number }[] = []

    for (let i = 0; i < 100; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 5
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)'
      ctx.lineWidth = 1

      raindrops.forEach(drop => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })
    }

    animate()

    return () => cancelAnimationFrame(animate as unknown as number)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const MouseTrail = () => {
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const trailLength = 20

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { x: e.clientX, y: e.clientY }]
        if (newTrail.length > trailLength) {
          newTrail.shift()
        }
        return newTrail
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="absolute w-4 h-4 rounded-full bg-white pointer-events-none"
          style={{
            left: point.x,
            top: point.y,
            opacity: 1 - index / trailLength,
            scale: 1 - index / trailLength,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1 - index / trailLength, scale: 1 - index / trailLength }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </>
  )
}

const LightTransition = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-blue-100 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-300 to-white mix-blend-overlay" />
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 20, rotate: 180 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white rounded-full opacity-30 blur-3xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Component() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outfit, setOutfit] = useState<{ image: string, description: string } | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { x, y } = useMouseParallax()

  useEffect(() => {
    setIsLoaded(true)
    const timer = setTimeout(() => {
      setShowTransition(true)
      setTimeout(() => {
        setShowInput(true)
        setShowTransition(false)
      }, 1500)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }
  }

  const generateOutfit = () => {
    setOutfit({
      image: "/placeholder.svg?height=400&width=300",
      description: "时尚休闲风: 白色T恤 + 牛仔外套 + 黑色紧身裤 + 白色运动鞋"
    })
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Image with Parallax Effect */}
      <motion.div className="absolute inset-0" style={{ x, y }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STYLY-LLQX4u1hA1PgVXow8WJbM71t0DyXtW.png"
          alt="Styly Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent mix-blend-overlay" />
      </motion.div>

      {/* Particles Effect */}
      <Particles />

      {/* Rain Effect */}
      <RainEffect />

      {/* Mouse Trail Effect */}
      <MouseTrail />

      {/* Light Transition Effect */}
      <LightTransition isVisible={showTransition} />

      {/* Animated Content */}
      <AnimatePresence>
        {!showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">AI Fashion</h1>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-center"
            >
              STYLY
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-2xl text-center text-lg md:text-xl text-gray-200 leading-relaxed"
            >
              "Styly" is a journey, a quest to unveil the attire that resonates with the rhythm of your heart.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isLoaded ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="w-full max-w-md h-1 mt-12 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Interface */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-300 via-blue-100 to-white"
          >
            <Card className="w-full max-w-4xl bg-white/50 backdrop-blur-md text-blue-800 shadow-xl">
              <CardHeader>
                <CardTitle>AI时尚穿搭助手</CardTitle>
                <CardDescription className="text-blue-600">上传你的单品照片，我们会为你生成完美穿搭</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture" className="text-white">上传单品照片</Label>
                      <Input id="picture" type="file" onChange={handleFileChange} className="bg-white/50 text-blue-800" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="occasion" className="text-white">场合</Label>
                      <Select>
                        <SelectTrigger id="occasion" className="bg-white/50 text-blue-800">
                          <SelectValue placeholder="选择场合" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">日常休闲</SelectItem>
                          <SelectItem value="work">工作场合</SelectItem>
                          <SelectItem value="party">派对聚会</SelectItem>
                          <SelectItem value="date">约会</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="birthday" className="text-white">生日</Label>
                      <Input type="date" id="birthday" placeholder="选择你的生日" className="bg-white/50 text-blue-800" />
                    </div>
                    <Button onClick={generateOutfit} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Sparkles className="mr-2 h-4 w-4" /> 生成穿搭方案
                    </Button>
                  </div>
                  {outfit && (
                    <Card className="w-full bg-white/30 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-blue-800">你的专属穿搭方案</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center">
                        <Image
                          src={outfit.image}
                          alt="AI生成的穿搭方案"
                          width={300}
                          height={400}
                          className="rounded-lg shadow-lg mb-4"
                        />
                        <p className="text-center text-sm text-blue-700">{outfit.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element for Sound Effects */}
      <audio ref={audioRef} src="/path-to-your-sound-effect.mp3" />
    </div>
  )
}


